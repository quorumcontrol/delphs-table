import { VStack, Text, Heading, Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../src/components/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Crypto Colosseum: Delph's Table</title>
      </Head>
      <Layout>
        <VStack mt="50" spacing={5}>
          <Heading>Delph's Table</Heading>
          <Text>Show support for your community.</Text>
          <Box pt="16">

          </Box>
        </VStack>
      </Layout>
    </>
  );
};

export default Home;
