import { VStack, Text, Heading, Box, Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import LoggedInLayout from "../../src/components/LoggedInLayout";
import useIsClientSide from "../../src/hooks/useIsClientSide";
import { useLogin } from "../../src/hooks/useUser";
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
  const [fullScreen, setFullScreen] = useState(false)

  const handleFullScreenMessage = useCallback(() => {
    setFullScreen((old) => !old)
  }, [setFullScreen])

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
        switch(appEvent.type) {
          case 'destinationSetter':
            console.log('set destination received')
            await handleMessage(appEvent)
            break;
          case 'fullScreenClick':
            return handleFullScreenMessage()
          default:
            console.log("unhandled message type: ", appEvent)
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
      <VStack spacing={fullScreen ? '0' : '10'}>
        <Heading>Find the Wootgump, don't get rekt.</Heading>
        <Text>Left Mouse (single finger) to orbit, right mouse (2 fingers) to pan, click-and-hold to set your player's destination (the blue star will move).</Text>
        {isClient && <Box
          id="game"
          as='iframe'
          src={`https://playcanv.as/e/p/wQEQB1Cp/?tableId=${tableId}&player=${address}`}
          ref={iframe}
          top='0'
          left='0'
          w={fullScreen ? '100vw' : '100%'}
          minH={fullScreen ? '100vh' : '70vh'}
          position={fullScreen ? 'fixed' : undefined}
        />}
      </VStack>
    </LoggedInLayout>
  );
};

export default Play;
