import React from "react";
import {
  Container,
  VStack,
  Box,
  Heading,
  Stack,
  Spacer,
  Text,
  Link,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import logo from "../../assets/images/logo.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useIsClientSide from "../hooks/useIsClientSide";
import { useUsername } from "../hooks/Player";
import { useAccount } from "wagmi";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isClient = useIsClientSide();
  const { address } = useAccount();
  const { data: username } = useUsername(address);

  return (
    <Container p={10} maxW="1200">
      <Stack direction={["column", "row"]} spacing="5">
        <LinkBox>
          <NextLink href="/" passHref>
            <LinkOverlay flexDir="row" display="flex" alignItems="center">
              <Image src={logo} alt="Crypto Colosseum logo" />
              <Heading size="sm" ml="5">
                Delph's Table
              </Heading>
            </LinkOverlay>
          </NextLink>
        </LinkBox>
        <Spacer />
        {isClient && username && (
          <NextLink href="/" passHref>
            <Text>{username}</Text>
          </NextLink>
        )}
        <Box ml="5">
          <ConnectButton showBalance={false} chainStatus={"none"} />
        </Box>
      </Stack>

      <VStack mt="10" spacing={5}>
        {children}
      </VStack>
      <Box as="footer" mt="200" textAlign="center">
        <Text fontSize="sm">
          <Link href="https://larvamaiorum.com/">
            A Crypto Colosseum: Larva Maiorum experience.
          </Link>
        </Text>
      </Box>
    </Container>
  );
};

export default Layout;
