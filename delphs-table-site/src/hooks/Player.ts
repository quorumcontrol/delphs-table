import { providers } from "ethers";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useProvider } from "wagmi";
import { Player, Player__factory } from "../../contracts/typechain";
import isTestnet from "../utils/isTestnet";
import { memoize } from "../utils/memoize";
import multicallWrapper from "../utils/multicallWrapper";

const TESTNET_ADDRESS = "0x0710E6e9869cEbc2666af31c89602dC0f9ffB663";
const MAINNET_ADDRESS = "";

export const PLAYER_ADDRESS = isTestnet ? TESTNET_ADDRESS : MAINNET_ADDRESS;

const playerContract = memoize((provider: providers.Provider) => {
  const multiCall = multicallWrapper(provider)
  return multiCall.syncWrap<Player>(Player__factory.connect(PLAYER_ADDRESS, provider))
})

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
