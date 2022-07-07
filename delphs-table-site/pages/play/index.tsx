import { VStack, Text, Heading, Button, Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import Layout from "../../src/components/Layout";
import LoggedInLayout from "../../src/components/LoggedInLayout";
import { useRegisterInterest, useWaitingPlayers } from "../../src/hooks/Lobby";
import { useUsername } from "../../src/hooks/Player";
import useIsClientSide from "../../src/hooks/useIsClientSide";
import { useDeviceSigner } from "../../src/hooks/useUser";

const Play: NextPage = () => {
  const { data:signer } = useDeviceSigner()
  const isClient = useIsClientSide()
  const { data:waitingPlayers } = useWaitingPlayers()
  const registerInterestMutation = useRegisterInterest()

  const onJoinClick = async () => {
    console.log('join click')
    try {
      return await registerInterestMutation.mutateAsync()
    } finally {
      console.log('tx complete')
    }
  }

  useEffect(() => {
    console.log('device signer: ', signer?.address)
  }, [signer])

  return (
    <>
      <LoggedInLayout>
        <VStack spacing={10}>
          <Heading>Play</Heading>
          <Text>Find the Wootgump, don't get rekt.</Text>
          <VStack p="4" spacing="2" borderWidth={1} borderColor="white">
            <Text>Waiting players</Text>
          {( isClient && waitingPlayers || []).map((addr) => {
            return <Text key={`waiting-addr-${addr}`}>{addr}</Text>
          })}
          </VStack>
          <Button onClick={onJoinClick}>Join Table</Button>
        </VStack>
      </LoggedInLayout>
    </>
  );
};

export default Play;
