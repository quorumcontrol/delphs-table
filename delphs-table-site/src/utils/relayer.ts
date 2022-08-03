import { Contract, Signer, Wallet } from 'ethers'
import KasumahRelayer from 'skale-relayer-contracts/lib/src/KasumahRelayer'
import { TrustedForwarder } from 'skale-relayer-contracts/lib/typechain-types'
import { delphsContract, lobbyContract, playerContract, trustedForwarderContract } from './contracts'
import { memoize } from './memoize'
import { skaleProvider } from './skaleProvider'
import { wrapContract } from 'kasumah-relay-wrapper'
import { createToken } from 'skale-relayer-contracts'
import EventEmitter from 'events'

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

  setToken(token: DeviceToken, user: Signer) {
    this.deviceToken = token
    this.forwarder = trustedForwarderContract().connect(this.deviceWallet!)
    this.relayer = new KasumahRelayer(this.forwarder, this.deviceWallet!, user)
    this.relayer.token = Promise.resolve(token)
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

}

const manager = new RelayManager()

export default manager
