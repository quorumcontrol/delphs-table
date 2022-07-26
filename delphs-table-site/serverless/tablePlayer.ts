
import { providers, Wallet } from "ethers";
import debug from 'debug'
import { skaleTestnet } from '../src/utils/SkaleChains'
import { keccak256 } from "ethers/lib/utils";
import { faker } from '@faker-js/faker'
import botSetup from '../contracts/bots'
import { OrchestratorState__factory } from "../contracts/typechain";
import { addresses } from "../src/utils/networks";
import { delphsContract, lobbyContract, playerContract } from "../src/utils/contracts";

const log = debug('tableMaker')
debug.enable('*')

if (!process.env.env_delphsPrivateKey) {
  throw new Error("must have a DELPHS private key")
}

function hashString(msg:string) {
  return keccak256(Buffer.from(msg))
}

async function getBots(num:number) {
  const botNames = Object.keys(botSetup)
  return botNames.slice(0, num).map((name) => {
    return {
      name,
      ...botSetup[name]
    }
  })
}

const provider = new providers.StaticJsonRpcProvider(skaleTestnet.rpcUrls.default)

const wallet = new Wallet(process.env.env_delphsPrivateKey!).connect(provider)

const lobby = lobbyContract(wallet, provider)
const delphs = delphsContract(wallet, provider)
const player = playerContract(provider)
const orchestratorState = OrchestratorState__factory.connect(addresses().OrchestratorState, wallet)

export async function handle(_event:any, _context:any, callback:any) {
  const ids = await orchestratorState.all()
  if (ids.length === 0) {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'ok',
        // transactionId: tx.hash,
        // tableId: id,
      }),
    })
  }
  const active = await Promise.all((ids).map(async (tableId) => {
    console.log('id: ', tableId)
    const metadata = await delphs.tables(tableId)
    return {
      id: tableId,
      metadata,
      start: metadata.startedAt,
      end: metadata.startedAt.add(metadata.gameLength)
    }
  }))
  const endings = active.map((tourn) => tourn.end).sort((a, b) => b.sub(a).toNumber()) // sort to largest first
  const currentTick = await delphs.latestRoll()

  console.log('rolling from ', currentTick.toNumber(), 'to', endings[0])

  for (let i = 0; i < endings[0].sub(currentTick).toNumber(); i++) {
    const tx = await delphs.rollTheDice()
    console.log('rolling: ', tx.hash)
    await tx.wait()
  }

  await orchestratorState.bulkRemove(active.map((table) => table.id))

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'ok',
      // transactionId: tx.hash,
      // tableId: id,
    }),
  })
}