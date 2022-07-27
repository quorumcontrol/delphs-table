import { useEffect } from "react"
import { useMutation } from "react-query"
import { useAccount } from "wagmi"
import { useWaitingPlayers } from "./Lobby"
import { useTableMetadata } from "./useDelphsTable"

const tableMakerUrl = 'https://delphsorchestratorbhepbzfb-table-maker.functions.fnc.fr-par.scw.cloud'
const tablePlayerUrl = 'https://delphsorchestratorbhepbzfb-table-player.functions.fnc.fr-par.scw.cloud'

const useTableMaker = () => {
  return useMutation(async () => {
    console.log('calling the table maker')
    const fetchPromise = fetch(tableMakerUrl, { method: 'POST' })
    fetchPromise.then((resp) => {
      console.log('resp from tableMaker: ', resp)
    }).catch((err) => {
      console.error('error form table maker: ', err)
    })
    return fetchPromise
  })
}

export const useTablePlayer = (tableId:string) => {
  const { data } = useTableMetadata(tableId)

  const player = useMutation(async () => {
    console.log('calling the tablePlayerUrl')
    const fetchPromise = fetch(tablePlayerUrl, { method: 'POST' })
    fetchPromise.then((resp) => {
      console.log('resp from tablePlayerUrl: ', resp)
    }).catch((err) => {
      console.error('error form tablePlayerUrl: ', err)
    })
    return fetchPromise
  })

  useEffect(() => {
    if (!data) {
      return
    }
    console.log("useTablePlayer data: ", data)
    console.log("gt? ", data.startedAt.gt(0), 'end: ', data.end.toNumber(), 'latest: ', data.latestRoll.toNumber())
    if (data.startedAt.gt(0) && data.end.gt(data.latestRoll)) {
      console.log("mutating the player")
      player.mutate()
    }
  }, [data])
}

export const useTableMakerWaiter = (amountOfTimeToWait = 30000) => {
  const maker = useTableMaker()
  const { address } = useAccount();
  const { data: waitingPlayers } = useWaitingPlayers();

  useEffect(() => {
    if (!address || !waitingPlayers || !waitingPlayers.some((waiting) => waiting.addr === address)) {
      return
    }
    console.log('setting timer to call the table maker')
    const timeoutTicker = setTimeout(maker.mutate, amountOfTimeToWait)
    return () => {
      clearTimeout(timeoutTicker)
    }
  }, [address, waitingPlayers, maker])

}

export default useTableMaker