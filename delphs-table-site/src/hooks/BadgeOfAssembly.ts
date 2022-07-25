import { BigNumber, providers } from "ethers"
import { useMemo } from "react"
import { useInfiniteQuery, useQuery } from "react-query"
import { useProvider } from "wagmi"
import { BadgeOfAssembly, BadgeOfAssembly__factory } from "../../badge-of-assembly-types/typechain"
import { isTestnet } from "../utils/networks"
import { memoize } from "../utils/memoize"
import ThenArg from "../utils/ThenArg"
import multicallWrapper from "../utils/multicallWrapper"

const TESTNET_BOA = "0xd8929b56BaD3B72068B682F19Cdeff92b2f5164B";
const MAINNET_BOA = "0x2C6FD25071Fd516947682f710f6e9F5eD610207F";

export const BOA_ADDRESS = isTestnet ? TESTNET_BOA : MAINNET_BOA

const badgeOfAssemblyContract = memoize((provider:providers.Provider) => {
  const multiCall = multicallWrapper(provider)
  return multiCall.syncWrap<BadgeOfAssembly>(BadgeOfAssembly__factory.connect(BOA_ADDRESS, provider))
})

const useBadgeOfAssembly = () => {
  const provider = useProvider()

  return useMemo(() => {
    return badgeOfAssemblyContract(provider)
  }, [provider])
}

export const useUserBadges = (address?:string) => {
  const badgeOfAssembly = useBadgeOfAssembly()
  const fetchUserTokens = async () => {
    const userTokenIds = await badgeOfAssembly.userTokens(address!)
    console.log('user tokens: ', userTokenIds, address)
    return Promise.all(userTokenIds.map(async (tokenId) => {
      const metadata = await badgeOfAssembly.metadata(tokenId)
      return {
        ...metadata,
        id: tokenId,
      }
    }))
  }
  return useQuery(['user-tokens', address], fetchUserTokens, {
    enabled: !!address
  })
}

export type MetadataWithId = ThenArg<ReturnType<BadgeOfAssembly['metadata']>> & { id: BigNumber }

const PAGE_SIZE = 50
export const useAllTokens = () => {
  const badgeOfAssembly = useBadgeOfAssembly()
  async function fetchTokenMetadata({ pageParam = 1 }) {
    const metadata = await Promise.all(Array(PAGE_SIZE).fill(true).map((_, i) => {
      return badgeOfAssembly.metadata(pageParam + i)
    }))
    const isMetadataBlank = (meta: typeof metadata[0]) => {
      return meta.name === ''
    }
    const isFinished = metadata.some(isMetadataBlank)
    console.log("use all tokens, isFinished: ", isFinished)
    const filteredMetas = metadata.map((meta, i) => {
      return {...meta, id: BigNumber.from(pageParam + i) }
    }).filter((meta) => !isMetadataBlank(meta))
    return {
      start: pageParam,
      length: filteredMetas.length,
      metadata: filteredMetas,
      isFinished
    }
  }

  return useInfiniteQuery('allTokens', fetchTokenMetadata, {
    getNextPageParam: (lastPage) => {
      if (lastPage.isFinished) {
        return undefined
      }
      return lastPage.start + lastPage.length
    }
  } )

}