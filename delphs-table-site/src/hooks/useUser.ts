import { utils } from "ethers";
import { useMutation, useQueryClient } from "react-query";
import { useAccount, useSigner } from "wagmi";
import { backOff } from "exponential-backoff";
import { useCallback, useEffect, useState } from "react";
import { skaleProvider } from "../utils/skaleProvider";
import relayer from "../utils/relayer";

const FAUCET_URL =
  "/api/local/faucet"; //TODO: fix me for the real thing


// const DEVICE_ID_KEY = "delphs:deviceId";
// const signatureMessage = (deviceId: string) =>
//   `I trust this device on Delphs Table. id: ${deviceId}`;
// // const encryptedDeviceKey = localStorage.getItem(ENCRYPTED_KEY)
// const getDeviceId = () => {
//   let deviceId = localStorage.getItem(DEVICE_ID_KEY);
//   if (!deviceId) {
//     deviceId = randomBytes(8).toString("hex")
//     localStorage.setItem(DEVICE_ID_KEY, deviceId);
//   }
//   return deviceId;
// }


// let devicePrivateKey: Buffer | undefined = undefined;
// let deviceSigner: Wallet | undefined = undefined;

// const deriveKey = (msg: Buffer, salt: Buffer) => {
//   return new Promise<Buffer>((resolve, reject) => {
//     pbkdf2(msg, salt, 1000, 32, "sha256", (err, derived) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(derived);
//     });
//   });
// };

export const useRelayer = () => {
  const [ready, setReady] = useState(relayer.ready())
  const [isLoading, setIsLoading] = useState(false)
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = () => {
      setReady(true)
    }
    relayer.on('ready', handler)
    return () => {
      relayer.off('ready', handler)
    }
  }, [relayer, setReady])

  const login = useCallback(async () => {
    try{
      setIsLoading(true)
      if (!signer) {
        console.error('missing dependencies: ', signer)
        throw new Error("no signer");
      }
      await relayer.createToken(signer)
      console.log('invaliating query')
      queryClient.cancelQueries(["device-signer"])
      queryClient.invalidateQueries(["device-signer"], {
        refetchInactive: true
      });
    } catch(err) {
      console.error('error login', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  
  }, [signer]);

 
  return { relayer, isLoading, ready, login };
};

export interface UserData {
  username: string;
  email?: string;
}

const thresholdForFaucet = utils.parseEther("0.25");

const useNewUser = () => {
  const { data:signer } = useSigner();

  return useMutation(async ({ username }: UserData) => {
    if (!signer) {
      throw new Error("no signer or player");
    }
    const address = await signer.getAddress()

    if (!relayer.ready()) {
      await relayer.createToken(signer)
    }

    const deviceSigner = relayer.deviceWallet!
    const balance = await deviceSigner.getBalance();

    if (balance.lte(thresholdForFaucet)) {
      const resp = await fetch(FAUCET_URL, {
        body: JSON.stringify({ userAddress: address, relayerAddress: deviceSigner.address, issuedAt: relayer.deviceToken!.issuedAt, token: relayer.deviceToken!.signature }),
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
          async () => {
            const tx = await skaleProvider.getTransaction(hash);
            console.log('tx inside backof: ', tx)
            return tx
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
    return relayer.wrapped.player().setUsername(username)

    //TODO: save email
  });
};

export default useNewUser;
