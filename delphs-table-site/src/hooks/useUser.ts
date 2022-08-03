import { useMutation, useQueryClient } from "react-query";
import { useSigner } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import relayer from "../utils/relayer";

export const useRelayer = () => {
  const [ready, setReady] = useState(relayer.ready())
  const [isLoading, setIsLoading] = useState(false)
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = () => {
      setReady(true)
    }
    relayer.on('ready', handler)
    return () => {
      relayer.off('ready', handler)
    }
  }, [relayer, setReady])

  const login = useCallback(async () => {
    try{
      setIsLoading(true)
      if (!signer) {
        console.error('missing dependencies: ', signer)
        throw new Error("no signer");
      }
      await relayer.createToken(signer)
      console.log('invaliating query')
      queryClient.cancelQueries(["device-signer"])
      queryClient.invalidateQueries(["device-signer"], {
        refetchInactive: true
      });
    } catch(err) {
      console.error('error login', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  
  }, [signer]);

 
  return { relayer, isLoading, ready, login };
};

export interface UserData {
  username: string;
  email?: string;
}

const useNewUser = () => {
  const { data:signer } = useSigner();

  return useMutation(async ({ username }: UserData) => {
    if (!signer) {
      throw new Error("no signer or player");
    }
    const address = await signer.getAddress()

    if (!relayer.ready()) {
      await relayer.createToken(signer)
    }
   
    console.log("setting username")
    const tx = await relayer.wrapped.player().setUsername(username, { gasLimit: 500_000 })
    console.log('tx: ', tx.hash)
    return tx.wait()
    //TODO: save email
  });
};

export default useNewUser;
