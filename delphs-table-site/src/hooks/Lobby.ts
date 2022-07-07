import { providers, Signer } from "ethers";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useProvider, useQuery } from "wagmi";
import { Lobby, Lobby__factory } from "../../contracts/typechain";
import isTestnet from "../utils/isTestnet";
import { memoize } from "../utils/memoize";
import multicallWrapper from "../utils/multicallWrapper";
import { usePlayer } from "./Player";
import { useDeviceSigner } from "./useUser";
import useWSSProvider from "./useWSSProvider";

const TESTNET_LOBBY = "0xe7975961089336F4aad364D26465447b310b5eDE";
const MAINNET_LOBBY = "";

export const LOBBY_ADDRESS = isTestnet ? TESTNET_LOBBY : MAINNET_LOBBY

const lobbyContract = memoize((signer:Signer, provider: providers.Provider) => {
  const multiCall = multicallWrapper(provider)
  return multiCall.syncWrap<Lobby>(Lobby__factory.connect(LOBBY_ADDRESS, signer))
})

const useLobbyContract = () => {
  const { data:signer } = useDeviceSigner()
  const provider = useProvider()

  return useQuery(['lobby-contract', signer], () => {
    return lobbyContract(signer!, provider)
  }, {
    enabled: !!signer
  })  
}

export const useWaitingPlayers = () => {
  const wssProvider = useWSSProvider()
  const queryClient = useQueryClient()
  const { data: lobbyContract } = useLobbyContract()
  const player = usePlayer()

  useEffect(() => {
    if (!lobbyContract) {
      return
    }
    const handleEvt = () => {
      queryClient.invalidateQueries('waiting-player', { refetchInactive: true })
    }
    const filter = lobbyContract!.filters.RegisteredInterest(null)
    lobbyContract!.connect(wssProvider).on(filter, handleEvt)
    return () => {
      lobbyContract.connect(wssProvider).off(filter, handleEvt)
    }
  }, [lobbyContract])

  return useQuery(['waiting-players'], async () => {
    console.log('waiting addresses: ', lobbyContract)
    const addrs = await lobbyContract!.waitingAddresses()
    return Promise.all(addrs.map((addr) => {
      return player.name(addr)
    }))
  }, {
    enabled: !!lobbyContract
  })
}

export const useRegisterInterest = () => {
  const { data: lobbyContract } = useLobbyContract()
  const queryClient = useQueryClient()

  return useMutation(async () => {
    if (!lobbyContract) {
      throw new Error('need a loby contract')
    }
    return lobbyContract.registerInterest().catch((err) => {
      console.error('error doing register: ', err)
      throw err
    }).then(() => {
      queryClient.invalidateQueries(['waiting-players'], {
        refetchInactive: true,
      })
    })
  })
}

