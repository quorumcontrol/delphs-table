import { useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useAccount, useProvider, useQuery } from "wagmi";
import { Lobby } from "../../contracts/typechain";
import { lobbyContract } from "../utils/contracts";
import { usePlayer } from "./Player";
import { useDeviceSigner } from "./useUser";
import useWSSProvider from "./useWSSProvider";

export const useLobbyContract = () => {
  const { data: signer } = useDeviceSigner();
  const provider = useProvider();

  return useMemo(() => {
    if (!signer) {
      return undefined;
    }
    return lobbyContract(signer, provider);
  }, [signer]);
};

export const useWaitingPlayers = () => {
  const wssProvider = useWSSProvider();
  const lobbyContract = useLobbyContract();
  const player = usePlayer();
  const query = useQuery(
    ["waiting-players"],
    async () => {
      console.log("waiting addresses: ", lobbyContract);
      const addrs = await lobbyContract!.waitingAddresses();
      return Promise.all(
        addrs.map(async (addr) => {
          return { name: await player.name(addr), addr };
        })
      );
    },
    {
      enabled: !!lobbyContract,
    }
  );

  useEffect(() => {
    if (!lobbyContract) {
      return;
    }
    const handleEvt = () => {
      query.refetch();
      // queryClient.invalidateQueries('waiting-player', { refetchInactive: true })
    };
    const filter = lobbyContract!.filters["RegisteredInterest(address)"](null);
    lobbyContract!.connect(wssProvider).on(filter, handleEvt);
    return () => {
      lobbyContract.connect(wssProvider).off(filter, handleEvt);
    };
  }, [lobbyContract, query]);

  return query;
};

export const useWaitForTable = (onTableStarted: (tableId?: string) => any) => {
  const { address } = useAccount();
  const lobbyContract = useLobbyContract();

  useEffect(() => {
    if (!address || !lobbyContract) {
      return;
    }
    const handle = (_: string, tableId: string, _evt: any) => {
      onTableStarted(tableId);
    };
    const filter = lobbyContract.filters.GameStarted(address, null);
    lobbyContract.on(filter, handle);
    return () => {
      lobbyContract.off(filter, handle);
    };
  }, [address, lobbyContract]);
};

export const useRegisterInterest = ({ lobbyContract }: { lobbyContract?: Lobby }) => {
  const queryClient = useQueryClient();

  return useMutation(async () => {
    if (!lobbyContract) {
      throw new Error("need a loby contract");
    }
    const tx = await lobbyContract.registerInterest();
    return tx
      .wait()
      .catch((err) => {
        console.error("error doing register: ", err);
        throw err;
      })
      .then(() => {
        queryClient.invalidateQueries("waiting-players", {
          refetchInactive: true,
        });
      });
  });
};
