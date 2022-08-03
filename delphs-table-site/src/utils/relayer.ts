import { Contract, Signer, utils, Wallet } from 'ethers'
import KasumahRelayer from 'skale-relayer-contracts/lib/src/KasumahRelayer'
import { TrustedForwarder } from 'skale-relayer-contracts/lib/typechain-types'
import { delphsContract, lobbyContract, playerContract, trustedForwarderContract } from './contracts'
import { memoize } from './memoize'
import { skaleProvider } from './skaleProvider'
import { wrapContract } from 'kasumah-relay-wrapper'
import { createToken } from 'skale-relayer-contracts'
import EventEmitter from 'events'
import { backOff } from 'exponential-backoff'

const FAUCET_URL =
  "https://delphsfaucetd3cqn3r9-faucet.functions.fnc.fr-par.scw.cloud";

const thresholdForFaucet = utils.parseEther("0.25");

interface DeviceToken {
  signature: string, issuedAt: number
}

const DEVICE_PK_KEY = "delphs:relayerKey"

const deviceWallet = memoize(() => {
  const storedKey = localStorage.getItem(DEVICE_PK_KEY)
  if (storedKey) {
    return new Wallet(storedKey).connect(skaleProvider)
  }
  const wallet = Wallet.createRandom()
  localStorage.setItem(DEVICE_PK_KEY, wallet.privateKey)
  return wallet.connect(skaleProvider)
})

class RelayManager extends EventEmitter {
  deviceToken?: DeviceToken
  relayer?: KasumahRelayer
  forwarder?: TrustedForwarder
  user?:Signer

  get deviceWallet() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return deviceWallet()
    }
    return undefined
  }

  wrapped = {
    player: memoize(() => {
      return this.wrap(playerContract())
    }),
    lobby: memoize(() => {
      return this.wrap(lobbyContract())
    }),
    delphsTable: memoize(() => {
      return this.wrap(delphsContract())
    })
  }

  async createToken(user: Signer) {
    const token = await createToken(trustedForwarderContract(), user, this.deviceWallet!)
    return this.setToken(token, user)
  }

  private async setToken(token: DeviceToken, user: Signer) {
    this.deviceToken = token
    this.forwarder = trustedForwarderContract().connect(this.deviceWallet!)
    this.relayer = new KasumahRelayer(this.forwarder, this.deviceWallet!, user)
    this.relayer.token = Promise.resolve(token)
    this.user = user
    await this.maybeGetFaucet()
    this.emit('ready')
  }

  ready() {
    return !!this.deviceToken && !!this.relayer
  }

  wrap<T>(contract: T) {
    if (!this.relayer) {
      throw new Error('wrapping before ready')
    }
    return wrapContract<T>((contract as unknown as Contract).connect(this.deviceWallet!), this.relayer)
  }

  private async maybeGetFaucet() {
    if (!this.deviceWallet || !this.user || !this.deviceToken) {
      throw new Error("cannot get faucet without wallet or user")
    }
    const [address, balance] = await Promise.all([
      this.user.getAddress(),
      this.deviceWallet.getBalance()
    ])

    if (balance.lte(thresholdForFaucet)) {
      const resp = await fetch(FAUCET_URL, {
        body: JSON.stringify({ userAddress: address, relayerAddress: this.deviceWallet.address, issuedAt: this.deviceToken.issuedAt, token: this.deviceToken!.signature }),
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
  }

}

const manager = new RelayManager()

export default manager
