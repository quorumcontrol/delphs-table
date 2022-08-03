import { providers, Signer } from "ethers";
import { TrustedForwarder, TrustedForwarder__factory } from 'skale-relayer-contracts/lib/typechain-types'
import { BadgeOfAssembly, BadgeOfAssembly__factory } from "../../badge-of-assembly-types/typechain";
import { DelphsTable, DelphsTable__factory, Lobby, Lobby__factory, Player, Player__factory } from "../../contracts/typechain";
import { memoize } from "../utils/memoize";
import multicallWrapper from "../utils/multicallWrapper";
import { addresses, isTestnet } from "../utils/networks";

const TESTNET_BOA = "0x881256ada5dD7CcB2457226C4bC978B067daF70B";
const MAINNET_BOA = "0x2C6FD25071Fd516947682f710f6e9F5eD610207F";

export const BOA_ADDRESS = isTestnet ? TESTNET_BOA : MAINNET_BOA

// the extra unused parameter of _address is here because memoize just does a .toString() on the args and both the signer and provider become [Object Object] so they get memoized even if the provider/signer change
export const delphsContract = memoize((signer: Signer, provider: providers.Provider, _address?: string) => {
  const multiCall = multicallWrapper(provider);
  const unwrapped = DelphsTable__factory.connect(addresses().DelphsTable, signer);
  return multiCall.syncWrap<DelphsTable>(unwrapped);;
});

export const badgeOfAssemblyContract = memoize((provider: providers.Provider) => {
  const multiCall = multicallWrapper(provider)
  return multiCall.syncWrap<BadgeOfAssembly>(BadgeOfAssembly__factory.connect(BOA_ADDRESS, provider))
})

// the extra unused parameter of _address is here because memoize just does a .toString() on the args and both the signer and provider become [Object Object] so they get memoized even if the provider/signer change
export const lobbyContract = memoize((signer: Signer, provider: providers.Provider, _address?: string) => {
  const multiCall = multicallWrapper(provider);
  const unwrapped = Lobby__factory.connect(addresses().Lobby, signer);
  return multiCall.syncWrap<Lobby>(unwrapped);
});

export const playerContract = memoize((provider: providers.Provider) => {
  const multiCall = multicallWrapper(provider)
  return multiCall.syncWrap<Player>(Player__factory.connect(addresses().Player, provider))
})

export const trustedForwarderContract = memoize((provider: providers.Provider) => {
  const multiCall = multicallWrapper(provider)
  return multiCall.syncWrap<TrustedForwarder>(TrustedForwarder__factory.connect(addresses().TrustedForwarder, provider))
})
