import { VStack, Text, Heading, Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { DelphsTable__factory } from "../../contracts/typechain";
import Layout from "../../src/components/Layout";
import LoggedInLayout from "../../src/components/LoggedInLayout";
import { DELPHS_TABLE_ADDRESS } from "../../src/hooks/DelphsTable";
import { useUsername } from "../../src/hooks/Player";
import useIsClientSide from "../../src/hooks/useIsClientSide";
import { useDeviceSigner } from "../../src/hooks/useUser";
import SingletonQueue from "../../src/utils/singletonQueue";

const txQueue = new SingletonQueue()

interface AppEvent {type:string, data: [number, number]}

const Play: NextPage = () => {
  const router = useRouter()
  console.log(router.query)
  const { tableId:untypedTableId } = router.query
  const tableId = untypedTableId as string
  const { address } = useAccount();
  const { data:username } = useUsername(address);
  const isClient = useIsClientSide();
  const iframe = useRef<HTMLIFrameElement>(null);
  const { data:signer } = useDeviceSigner()

  useEffect(() => {
    console.log('device signer: ', signer?.address)
  }, [signer])

  const handleMessage = useCallback(async (appEvent:AppEvent) => {
    if (!signer) {
      throw new Error('no signer')
    }
    const delphsTable = DelphsTable__factory.connect(DELPHS_TABLE_ADDRESS, signer)
    console.log('signer addr: ', await signer.getAddress(), 'params', tableId, appEvent.data[0], appEvent.data[1])
    txQueue.push(async () => {
      const tx = await delphsTable.setDestination(tableId, appEvent.data[0], appEvent.data[1])
      console.log('destination tx: ', tx)
      return tx.wait()
    })
  }, [signer])

  useEffect(() => {
    const handler = async (evt:MessageEvent) => {
      if (evt.origin === "https://playcanv.as") {
        const appEvent:AppEvent = JSON.parse(evt.data)
        if (appEvent.type === 'destinationSetter') {
          console.log('set destination received')
          await handleMessage(appEvent)
          iframe.current?.contentWindow?.postMessage('OK')
        }
      }

    }
    window.addEventListener('message', handler)
    return () => {
      window.removeEventListener('message', handler)
    }
  }, [signer])

  return (
    <LoggedInLayout>
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
    </LoggedInLayout>
  );
};

export default Play;
