import { providers, Signer } from "ethers";
import { BadgeOfAssembly, BadgeOfAssembly__factory } from "../../badge-of-assembly-types/typechain";
import { DelphsTable, DelphsTable__factory, Lobby, Lobby__factory, Player, Player__factory } from "../../contracts/typechain";
import { memoize } from "../utils/memoize";
import multicallWrapper from "../utils/multicallWrapper";
import { addresses, isTestnet } from "../utils/networks";

const TESTNET_BOA = "0xd8929b56BaD3B72068B682F19Cdeff92b2f5164B";
const MAINNET_BOA = "0x2C6FD25071Fd516947682f710f6e9F5eD610207F";

export const BOA_ADDRESS = isTestnet ? TESTNET_BOA : MAINNET_BOA

// the extra unused parameter of _address is here because memoize just does a .toString() on the args and both the signer and provider become [Object Object] so they get memoized even if the provider/signer change
export const delphsContract = memoize((signer: Signer, provider: providers.Provider, _address?:string) => {
  const multiCall = multicallWrapper(provider);
  const unwrapped = DelphsTable__factory.connect(addresses().DelphsTable, signer);
  const wrapped = multiCall.syncWrap<DelphsTable>(unwrapped);
  return wrapped;
});

export const badgeOfAssemblyContract = memoize((provider:providers.Provider) => {
  const multiCall = multicallWrapper(provider)
  return multiCall.syncWrap<BadgeOfAssembly>(BadgeOfAssembly__factory.connect(BOA_ADDRESS, provider))
})

// the extra unused parameter of _address is here because memoize just does a .toString() on the args and both the signer and provider become [Object Object] so they get memoized even if the provider/signer change
export const lobbyContract = memoize((signer: Signer, provider: providers.Provider, _address?:string) => {
  const multiCall = multicallWrapper(provider);
  const unwrapped = Lobby__factory.connect(addresses().Lobby, signer);
  const wrapped = multiCall.syncWrap<Lobby>(unwrapped);
  return wrapped;
});

export const playerContract = memoize((provider: providers.Provider) => {
  const multiCall = multicallWrapper(provider)
  return multiCall.syncWrap<Player>(Player__factory.connect(addresses().Player, provider))
})
