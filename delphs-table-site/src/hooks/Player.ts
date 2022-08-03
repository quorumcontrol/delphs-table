import { useMemo } from "react";
import { useQuery } from "react-query";
import { useProvider } from "wagmi";
import { playerContract } from "../utils/contracts";

export const useUsername = (address?: string) => {
  const fetchIsInitialized = () => {
    return playerContract().name(address!);
  };
  return useQuery(["player:username", address], fetchIsInitialized, {
    enabled: !!address
  });
};
