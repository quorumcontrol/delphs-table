import { VStack, Text, Heading, Box, Spinner, Link, Button} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useCallback, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { DelphsTable__factory } from "../contracts/typechain";
import Layout from "../src/components/Layout";
import { DELPHS_TABLE_ADDRESS } from "../src/hooks/DelphsTable";
import { useUsername } from "../src/hooks/Player";
import useIsClientSide from "../src/hooks/useIsClientSide";
import { useDeviceSigner } from "../src/hooks/useUser";

const tableId = '0xfc06bf6d9903056f5988cf49efdb41604886f39f728eab220170e37e2bb3fc69'

const Play: NextPage = () => {
  const { data } = useAccount();
  const { data:username } = useUsername(data?.address);
  const isClient = useIsClientSide();
  const iframe = useRef<HTMLIFrameElement>(null);
  const { data:signer } = useDeviceSigner()

  useEffect(() => {
    console.log('device signer: ', signer?.address)
  }, [signer])

  useEffect(() => {
    const handler = async (evt:MessageEvent) => {
      if (evt.origin === "https://playcanv.as") {
        const appEvent:{type:string, data: [number, number]} = JSON.parse(evt.data)
        if (appEvent.type === 'destinationSetter') {
          console.log('set destination received')
          if (!signer) {
            console.log('no signer')
            return
          }
          const delphsTable = DelphsTable__factory.connect(DELPHS_TABLE_ADDRESS, signer)
          console.log('signer addr: ', await signer.getAddress(), 'params', tableId, appEvent.data[0], appEvent.data[1])
          const tx = await delphsTable.setDestination(tableId, appEvent.data[0], appEvent.data[1])
          console.log('destination tx: ', tx)
          iframe.current?.contentWindow?.postMessage('OK')
        }
      }

    }
    window.addEventListener('message', handler)
    return () => {
      window.removeEventListener('message', handler)
    }
  }, [])

  return (
    <>
      <Layout>
        <VStack spacing={10}>
          <Heading>Play</Heading>
          <Text>Find the Wootgump, don't get rekt.</Text>
          <Text>{isClient && username}</Text>
          {isClient && <Box
            id="game"
            as='iframe'
            src={`https://playcanv.as/e/p/wQEQB1Cp/?tableId=${tableId}&player=${data?.address}`}
            ref={iframe}
            minW="1200px"
            minH="800px"
          />}
        </VStack>
      </Layout>
    </>
  );
};

export default Play;
