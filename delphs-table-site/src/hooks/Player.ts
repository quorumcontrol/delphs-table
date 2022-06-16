import { useMemo } from "react";
import { useQuery } from "react-query";
import { useProvider } from "wagmi";
import { Player__factory } from "../../contracts/typechain";
import isTestnet from "../utils/isTestnet";

const TESTNET_ADDRESS = "0xb0A616e35622c5eB72589cfE5cB1Ec46B35572C6";
const MAINNET_ADDRESS = "";

export const PLAYER_ADDRESS = isTestnet ? TESTNET_ADDRESS : MAINNET_ADDRESS;

export const usePlayer = () => {
  const provider = useProvider();

  return useMemo(() => {
    return Player__factory.connect(PLAYER_ADDRESS, provider);
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