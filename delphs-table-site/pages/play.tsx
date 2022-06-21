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
import SingletonQueue from "../src/utils/singletonQueue";

const tableId = '0x7686f99f3fd9247226d3bd6537aa0370b224b3b77fc75d0ff340668c40577ae6'

const txQueue = new SingletonQueue()

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
          txQueue.push(async () => {
            const tx = await delphsTable.setDestination(tableId, appEvent.data[0], appEvent.data[1])
            console.log('destination tx: ', tx)
            return tx.wait()
          })
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
