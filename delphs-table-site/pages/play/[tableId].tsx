import { VStack, Text, Heading, Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import LoggedInLayout from "../../src/components/LoggedInLayout";
import useIsClientSide from "../../src/hooks/useIsClientSide";
import { useRelayer } from "../../src/hooks/useUser";
import { delphsContract } from "../../src/utils/contracts";
import promiseWaiter from "../../src/utils/promiseWaiter";
import relayer from "../../src/utils/relayer";
import SingletonQueue from "../../src/utils/singletonQueue";

const txQueue = new SingletonQueue()

interface AppEvent {type:string, data: [number, number]}

const Play: NextPage = () => {
  const router = useRouter()
  const { tableId:untypedTableId } = router.query
  const tableId = untypedTableId as string
  const { address } = useAccount();
  const isClient = useIsClientSide();
  const iframe = useRef<HTMLIFrameElement>(null);

  const handleMessage = useCallback(async (appEvent:AppEvent) => {
    if (!relayer.ready()) {
      throw new Error('no signer')
    }

    console.log('params', tableId, appEvent.data[0], appEvent.data[1])
    txQueue.push(async () => {
      await promiseWaiter(500) // try to fix a broken nonce issue
      const delphsTable = relayer.wrapped.delphsTable()

      iframe.current?.contentWindow?.postMessage(JSON.stringify({
        type: 'destinationStarting',
        x: appEvent.data[0],
        y: appEvent.data[1],
      }), '*')
      const tx = await delphsTable.setDestination(tableId, appEvent.data[0], appEvent.data[1], { gasLimit: 250000 }) // normally around 80k
      console.log('--------------- destination tx: ', tx)
      return await tx.wait().then((receipt) => {
        console.log('------------ destination receipt: ', receipt)
        iframe.current?.contentWindow?.postMessage(JSON.stringify({
          type: 'destinationComplete',
          x: appEvent.data[0],
          y: appEvent.data[1],
          success: true,
        }), '*')
      }).catch((err) => {
        console.error('----------- error with destinationSetter', err)
        iframe.current?.contentWindow?.postMessage(JSON.stringify({
          type: 'destinationComplete',
          x: appEvent.data[0],
          y: appEvent.data[1],
          success: false,
        }), '*')
      })
    })
  }, [relayer])

  useEffect(() => {
    const handler = async (evt:MessageEvent) => {
      if (evt.origin === "https://playcanv.as") {
        const appEvent:AppEvent = JSON.parse(evt.data)
        if (appEvent.type === 'destinationSetter') {
          console.log('set destination received')
          await handleMessage(appEvent)
          // iframe.current?.contentWindow?.postMessage()
        }
      }

    }
    console.log('add destination listener')
    window.addEventListener('message', handler)
    return () => {
      console.log('removing destination listener')
      window.removeEventListener('message', handler)
    }
  }, [handleMessage])

  return (
    <LoggedInLayout>
      <VStack spacing={10}>
        <Heading>Find the Wootgump, don't get rekt.</Heading>
        <Text>Left Mouse (single finger) to orbit, right mouse (2 fingers) to pan, click-and-hold to set your player's destination.</Text>
        {isClient && <Box
          id="game"
          as='iframe'
          src={`https://playcanv.as/e/p/wQEQB1Cp/?tableId=${tableId}&player=${address}`}
          ref={iframe}
          minW="1200px"
          minH="800px"
        />}
      </VStack>
    </LoggedInLayout>
  );
};

export default Play;
