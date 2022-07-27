import { useMemo } from "react";
import { useQuery } from "react-query";
import { useProvider } from "wagmi";
import { delphsContract } from "../utils/contracts";
import { useDeviceSigner } from "./useUser";

export const useDelphsTableContract = () => {
  const { data: signer } = useDeviceSigner();
  const provider = useProvider();

  return useMemo(() => {
    if (!signer) {
      return undefined;
    }
    return delphsContract(signer, provider, signer.address);
  }, [signer, provider]);
};

export const useTableMetadata = (tableId:string) => {
  const delphsTable = useDelphsTableContract()

  return useQuery(['table-metadata', tableId], async () => {
    if (!delphsTable) {
      throw new Error('missing delphs table')
    }
    const [meta, latestRoll] = await Promise.all([
      delphsTable.tables(tableId),
      delphsTable.latestRoll()
    ])
    return {
      startedAt: meta.startedAt,
      length: meta.gameLength,
      end: meta.startedAt.add(meta.gameLength),
      latestRoll,
    }
  }, {
    enabled: !!delphsTable
  })
}