import { utils, Wallet } from "ethers";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "react-query";
import { useProvider, useSigner } from "wagmi";
import { usePlayer } from "./Player";
import { backOff } from "exponential-backoff";
import { useCallback, useMemo } from "react";
import { pbkdf2, randomBytes } from "crypto";
import useIsClientSide from "./useIsClientSide";

const FAUCET_URL =
  "https://larvamaiorumfaucet5sqygfv0-first.functions.fnc.fr-par.scw.cloud";

const DEVICE_ID_KEY = "delphs:deviceId";
const signatureMessage = (deviceId: string) =>
  `I trust this device on Delphs Table. id: ${deviceId}`;
// const encryptedDeviceKey = localStorage.getItem(ENCRYPTED_KEY)
const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = randomBytes(8).toString("hex")
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}


let devicePrivateKey: Buffer | undefined = undefined;
let deviceSigner: Wallet | undefined = undefined;

const deriveKey = (msg: Buffer, salt: Buffer) => {
  return new Promise<Buffer>((resolve, reject) => {
    pbkdf2(msg, salt, 1000, 32, "sha256", (err, derived) => {
      if (err) {
        return reject(err);
      }
      resolve(derived);
    });
  });
};

export const useDeviceSigner = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();
  const provider = useProvider();
  const player = usePlayer();

  const login = useCallback(async () => {
    const deviceId = getDeviceId();
    if (!signer || !deviceId) {
      console.error('missing dependencies: ', signer, deviceId)
      throw new Error("no signer");
    }
    const sig = await signer.signMessage(signatureMessage(getDeviceId()!));
    devicePrivateKey = await deriveKey(
      Buffer.from(sig.slice(2, -1), "hex"),
      Buffer.from(deviceId)
    );
    // console.log('device private key: ', Buffer.from(devicePrivateKey).toString('hex'))
    const device = await fetchDeviceSigner();
    if (
      !(
        (await player.deviceToPlayer(await device.getAddress())) ===
        (await signer.getAddress())
      )
    ) {
      console.log("new device");
      await player
        .connect(signer)
        .addDevice(device.address, { value: utils.parseEther("0.05") });
    } else if ((await device.getBalance()).lt(utils.parseEther("0.05"))) {
      await signer.sendTransaction({
        to: await device.getAddress(),
        value: utils.parseEther("0.05"),
      });
    }
    console.log('invaliating query')
    queryClient.cancelQueries(["device-signer"])
    queryClient.invalidateQueries(["device-signer"], {
      refetchInactive: true
    });
  }, [signer]);

  const fetchDeviceSigner = async () => {
    console.log("fetch device signer");
    if (!devicePrivateKey) {
      throw new Error("can only fetch after decryption key is set");
    }

    if (deviceSigner) {
      return deviceSigner;
    }
    console.log("decrypting");
    if (!signer?.provider) {
      throw new Error("no signer yet");
    }

    deviceSigner = new Wallet(devicePrivateKey).connect(signer.provider);
    console.log("decrypted", "device address: ", await deviceSigner.getAddress());

    return deviceSigner;
  };

  const query: UseQueryResult<Wallet, unknown> = useQuery(
    "device-signer",
    fetchDeviceSigner,
    {
      enabled: !!devicePrivateKey && !!provider,
    }
  );
  return { ...query, login };
};

export const useDeviceKey = () => {
  const isClientSide = useIsClientSide();

  return useMemo(() => {
    if (!isClientSide) {
      return undefined;
    }
    return getDeviceId()
  }, [isClientSide]);
};

export interface UserData {
  username: string;
  email?: string;
  trustDevice: boolean;
}

const thresholdForFaucet = utils.parseEther("0.25");

const useNewUser = () => {
  const player = usePlayer();
  const { data: signer } = useSigner();
  const deviceId = useDeviceKey();

  return useMutation(async ({ username, trustDevice }: UserData) => {
    if (!signer || !player) {
      throw new Error("no signer or player");
    }

    const balance = await signer.getBalance();

    if (balance.lte(thresholdForFaucet)) {
      const resp = await fetch(FAUCET_URL, {
        body: JSON.stringify({ address: await signer.getAddress() }),
        method: "post",
      });
      if (![200, 201].includes(resp.status)) {
        console.error("bad response from faucet: ", resp.status);
        throw new Error(`Bad response: ${resp.status} ${JSON.stringify(resp.json())}`);
      }
      const hash: string | undefined = (await resp.json()).transactionId;
      console.log("received: ", hash);

      if (hash) {
        console.log("waiting on: ", hash);
        const tx = await backOff(
          () => {
            if (!signer.provider) {
              console.error("missing provider");
              throw new Error("missing provider");
            }
            return signer.provider.getTransaction(hash);
          },
          {
            startingDelay: 500,
            maxDelay: 1000,
            numOfAttempts: 10,
          }
        );
        if (!tx) {
          throw new Error("missing tx");
        }
        await tx.wait();
      }
    }

    if (trustDevice) {
      const sig = await signer.signMessage(signatureMessage(deviceId!));
      const wallet = new Wallet(
        await deriveKey(Buffer.from(sig.slice(2, -1), "hex"), Buffer.from(deviceId!))
      );
      deviceSigner = wallet;
      const addr = await wallet.getAddress();
      console.log("device address: ", addr);

      return player
        .connect(signer)
        .initializePlayer(username, addr, { value: utils.parseEther("0.1") });
    }

    // first get the user to do their own initialization
    return player.connect(signer).initializePlayer(username, await signer.getAddress());

    //TODO: save email
  });
};

export default useNewUser;
