import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useAccount, useQuery } from "wagmi";
import { Lobby } from "../../contracts/typechain";
import { lobbyContract, playerContract } from "../utils/contracts";
import relayer from "../utils/relayer";

export const useWaitingPlayers = () => {
  const query = useQuery(
    ["waiting-players"],
    async () => {
      const addrs = await lobbyContract().waitingAddresses();
      return Promise.all(
        addrs.map(async (addr) => {
          return { name: await playerContract().name(addr), addr };
        })
      );
    }
  );

  useEffect(() => {
    const handleEvt = () => {
      query.refetch();
      // queryClient.invalidateQueries('waiting-player', { refetchInactive: true })
    };
    const filter = lobbyContract().filters["RegisteredInterest(address)"](null);
    lobbyContract().on(filter, handleEvt);
    return () => {
      lobbyContract().off(filter, handleEvt);
    };
  }, [lobbyContract, query]);

  return query;
};

export const useWaitForTable = (onTableStarted: (tableId?: string) => any) => {
  const { address } = useAccount();

  useEffect(() => {
    if (!address || !lobbyContract) {
      return;
    }
    const handle = (_: string, tableId: string, _evt: any) => {
      onTableStarted(tableId);
    };
    const filter = lobbyContract().filters.GameStarted(address, null);
    lobbyContract().on(filter, handle);
    return () => {
      lobbyContract().off(filter, handle);
    };
  }, [address, lobbyContract]);
};

export const useRegisterInterest = () => {
  const queryClient = useQueryClient();

  return useMutation(async () => {
    if (!relayer.ready()) {
      throw new Error("the relayer must be ready to register interest");
    }
    const tx = await relayer.wrapped.lobby().registerInterest();
    await tx.wait()
    queryClient.invalidateQueries(["waiting-players"], {
      refetchInactive: true,
    });
  });
};
