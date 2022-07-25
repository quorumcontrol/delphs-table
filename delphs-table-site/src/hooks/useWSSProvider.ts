import { providers } from "ethers"
import { Chain } from "wagmi"
import { isTestnet } from "../utils/networks"
import { memoize } from "../utils/memoize"
import { skaleMainnet, skaleTestnet } from "../utils/SkaleChains"

const chain = isTestnet ? skaleTestnet : skaleMainnet

const getProvider = memoize((chain:Chain) => {
  const url = chain.rpcUrls.wss
  if (!url) {
    throw new Error('no url')
  }
  return new providers.WebSocketProvider(url)
})

const useWSSProvider = () => {
  return getProvider(chain)
}

export default useWSSProvider
