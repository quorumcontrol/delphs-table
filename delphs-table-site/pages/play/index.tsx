import {
  VStack,
  Text,
  Heading,
  Button,
  Box,
  Spinner,
  Flex,
  HStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import Layout from "../../src/components/Layout";
import LoggedInLayout from "../../src/components/LoggedInLayout";
import {
  useLobbyContract,
  useRegisterInterest,
  useWaitForTable,
  useWaitingPlayers,
} from "../../src/hooks/Lobby";
import useIsClientSide from "../../src/hooks/useIsClientSide";
import { useDeviceSigner } from "../../src/hooks/useUser";

const Play: NextPage = () => {
  const { address } = useAccount();
  const { data: signer } = useDeviceSigner();
  const isClient = useIsClientSide();
  const { data: waitingPlayers, isLoading } = useWaitingPlayers();
  const lobbyContract = useLobbyContract()
  const registerInterestMutation = useRegisterInterest({ lobbyContract });
  const router = useRouter();

  const handleTableRunning = useCallback(
    (tableId?: string) => {
      router.push(`/play/${tableId}`);
    },
    [router]
  );

  useWaitForTable(handleTableRunning);

  const isWaiting = (waitingPlayers || []).some((waiting) => waiting.addr === address);

  const onJoinClick = async () => {
    console.log("join click");
    try {
      return registerInterestMutation.mutate();
    } finally {
      console.log("tx complete");
    }
  };

  useEffect(() => {
    console.log("device signer: ", signer?.address);
  }, [signer]);

  return (
    <>
      <LoggedInLayout>
        <VStack spacing={10}>
          <Heading>Play</Heading>
          <Text>Find the Wootgump, don't get rekt.</Text>
          <VStack p="4" spacing="2" borderWidth={1} borderColor="white">
            <Text mb="4">Players waiting for a table</Text>
            {isLoading && <Spinner />}
            {((isClient && !isLoading && waitingPlayers) || []).map((waiting) => {
              return <Text fontSize="md" key={`waiting-addr-${waiting.addr}`}>{waiting.name}</Text>;
            })}
          </VStack>
          {registerInterestMutation.isLoading && <Spinner />}
          {!isWaiting && !registerInterestMutation.isLoading && (
            <Button onClick={onJoinClick}>Join Table</Button>
          )}
          {isWaiting && (
            <HStack>
              <Text>Waiting</Text>
              <Spinner />
            </HStack>
          )}
        </VStack>
      </LoggedInLayout>
    </>
  );
};

export default Play;
