import { providers } from "ethers";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useProvider } from "wagmi";
import { Player, Player__factory } from "../../contracts/typechain";
import { addresses } from "../utils/networks";
import { memoize } from "../utils/memoize";
import multicallWrapper from "../utils/multicallWrapper";

export const PLAYER_ADDRESS = addresses().Player

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
