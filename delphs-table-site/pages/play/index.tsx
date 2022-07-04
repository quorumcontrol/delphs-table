import { VStack, Text, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import Layout from "../../src/components/Layout";
import { useUsername } from "../../src/hooks/Player";
import useIsClientSide from "../../src/hooks/useIsClientSide";
import { useDeviceSigner } from "../../src/hooks/useUser";

const Play: NextPage = () => {
  const { data } = useAccount();
  const { data:username } = useUsername(data?.address);
  const isClient = useIsClientSide();
  const { data:signer } = useDeviceSigner()

  useEffect(() => {
    console.log('device signer: ', signer?.address)
  }, [signer])

  return (
    <>
      <Layout>
        <VStack spacing={10}>
          <Heading>Play</Heading>
          <Text>Find the Wootgump, don't get rekt.</Text>
          <Text>{isClient && username}</Text>
          <Text>Future home of the lobby.</Text>
        </VStack>
      </Layout>
    </>
  );
};

export default Play;
