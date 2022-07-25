import { VStack, Text, Heading, Box, Spinner, Link, Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useAccount } from "wagmi";
import Layout from "../src/components/Layout";
import { useIsInitialized, useUsername } from "../src/hooks/Player";
import useIsClientSide from "../src/hooks/useIsClientSide";
import { useDeviceSigner } from "../src/hooks/useUser";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { isInitialized, isLoading } = useIsInitialized(address);
  const { data: username } = useUsername(address);
  const {
    data: deviceSigner,
    isLoading: deviceSignerIsLoading,
    login,
  } = useDeviceSigner();
  const isClient = useIsClientSide();

  return (
    <>
      <Layout>
        <VStack mt="50" spacing={5}>
          <Heading>Delph's Table</Heading>
          <Text>Find the Wootgump, don't get rekt.</Text>
          <Box pt="16">
            {isClient && isLoading && <Spinner />}
            {isClient && !isLoading && address && !isInitialized && (
              <VStack>
                <Text>
                  Looks like this is your first time here. Let's get you setup. You'll
                  need to have a
                  <NextLink passHref href="https://boa.larvamaiorum.com/claim">
                    <Link>a badge of assembly</Link>
                  </NextLink>
                  to play.
                </Text>
                <NextLink passHref href="/new">
                  <Link>
                    <Button>Create Account</Button>
                  </Link>
                </NextLink>
              </VStack>
            )}
            {isClient && !isLoading && address && isInitialized && (
              <VStack spacing="5">
                <Text>Welcome back {username}.</Text>
                {deviceSignerIsLoading && <Spinner />}
                {!deviceSigner && !deviceSignerIsLoading && (
                  <Button onClick={login}>Login</Button>
                )}
                {deviceSigner && (
                  <NextLink passHref href="/play">
                    <Link>
                      <Button>Play</Button>
                    </Link>
                  </NextLink>
                )}
              </VStack>
            )}
          </Box>
        </VStack>
      </Layout>
    </>
  );
};

export default Home;
