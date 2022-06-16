import { VStack, Text, Heading, Box, Spinner, Link, Button} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useAccount } from "wagmi";
import Layout from "../src/components/Layout";
import { useIsInitialized, useUsername } from "../src/hooks/Player";
import useIsClientSide from "../src/hooks/useIsClientSide";

const Home: NextPage = () => {
  const { data } = useAccount();
  const { data:username } = useUsername(data?.address);
  const isClient = useIsClientSide();

  return (
    <>
      <Layout>
        <VStack spacing={10}>
          <Heading>Play</Heading>
          <Text>Find the Wootgump, don't get rekt.</Text>
          <Text>{isClient && username}</Text>
        </VStack>
      </Layout>
    </>
  );
};

export default Home;
