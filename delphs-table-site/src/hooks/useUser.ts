import { utils, Wallet } from "ethers";
import { useMutation } from "react-query"
import { useSigner } from "wagmi";
import { usePlayer } from "./Player";
import { backOff } from "exponential-backoff";
import { useMemo } from "react";
import { randomBytes } from "crypto";
import useIsClientSide from "./useIsClientSide";

const ENCRYPTED_KEY = 'delphs:epk'
const DEVICE_ID_KEY = 'delphs:deviceId'

// const encryptedDeviceKey = localStorage.getItem(ENCRYPTED_KEY)

export const useDeviceKey = () => {
  const isClientSide = useIsClientSide()

  return useMemo(() => {
    if (!isClientSide) {
      return undefined
    }
    const deviceId = localStorage.getItem(DEVICE_ID_KEY)
    if (deviceId) {
      return deviceId
    }
    localStorage.setItem(DEVICE_ID_KEY, randomBytes(8).toString('hex'))
  }, [isClientSide])
}

export interface UserData {
  username: string;
  email?: string;
  trustDevice: boolean;
}

const thresholdForFaucet = utils.parseEther('0.25')

const useNewUser = () => {
  const player = usePlayer()
  const { data:signer } = useSigner()
  const deviceKey = useDeviceKey()

  return useMutation(async ({ username, trustDevice}:UserData) => {
    if (!signer || !player) {
      throw new Error('no signer or player')
    }
    
    const balance = await signer.getBalance()
    
    if (balance.lte(thresholdForFaucet)) {
      const resp = await fetch('/api/faucet', {
        body: JSON.stringify({address: await signer.getAddress()}),
        method: 'post',
      })
      if (![200,201].includes(resp.status)) {
        throw new Error(`Bad response: ${resp.status} ${JSON.stringify(resp.json()) }`)
      }
      const hash:string|undefined = (await resp.json()).transactionId

      if (hash) {
        console.log('waiting on: ', hash)
        const tx = await backOff(() => {
          if (!signer.provider) {
            throw new Error('missing provider')
          }
          return signer.provider.getTransaction(hash)
        }, {
          startingDelay: 500,
          numOfAttempts: 5,
        })
        if (!tx) {
          throw new Error('missing tx')
        }
        await tx.wait()
      }
    }
    
    if (trustDevice) {
      const sig = await signer.signMessage(`I trust this device on Delphs Table. id: ${deviceKey}`)
      const wallet = Wallet.createRandom()
      const encrypted = await wallet.encrypt(sig)
      localStorage.setItem(ENCRYPTED_KEY, encrypted)

      // get a signature
      // do nothing until we get the rest working here
    }
    // first get the user to do their own initialization
    //TODO: use the device key
    await player.connect(signer).initializePlayer(username, await signer.getAddress())

    //TODO: save email
  })

}

export default useNewUser
