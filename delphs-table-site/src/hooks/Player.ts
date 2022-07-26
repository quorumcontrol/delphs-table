import { useMemo } from "react";
import { useQuery } from "react-query";
import { useProvider } from "wagmi";
import { playerContract } from "../utils/contracts";

export const usePlayer = () => {
  const provider = useProvider();

  return useMemo(() => {
    return playerContract(provider);
  }, [provider]);
};

export const useIsInitialized = (address?: string) => {
  const player = usePlayer();

  const fetchIsInitialized = () => {
    return player.isInitialized(address!);
  };
  const query = useQuery(["player:is-initialized", address], fetchIsInitialized, {
    enabled: !!address && !!player,
  });
  return { ...query, isInitialized: query.data };
};

export const useUsername = (address?: string) => {
  const player = usePlayer();

  const fetchIsInitialized = () => {
    return player.name(address!);
  };
  return useQuery(["player:username", address], fetchIsInitialized, {
    enabled: !!address && !!player,
  });
};
