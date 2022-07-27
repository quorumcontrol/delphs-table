
import { providers, Wallet } from "ethers";
import debug from 'debug'
import { skaleTestnet } from '../src/utils/SkaleChains'
import { OrchestratorState__factory } from "../contracts/typechain";
import { addresses } from "../src/utils/networks";
import { delphsContract } from "../src/utils/contracts";

let locked = false // only one allowed

const log = debug('tablePlayer')
debug.enable('*')

if (!process.env.env_delphsPrivateKey) {
  throw new Error("must have a DELPHS private key")
}

const provider = new providers.StaticJsonRpcProvider(skaleTestnet.rpcUrls.default)

const wallet = new Wallet(process.env.env_delphsPrivateKey!).connect(provider)

const delphs = delphsContract(wallet, provider)
const orchestratorState = OrchestratorState__factory.connect(addresses().OrchestratorState, wallet)

export async function handle(_event:any, _context:any, callback:any) {
  try {
    if (locked) {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: 'locked',
        }),
      })
    }
    locked = true
    
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
      log('id: ', tableId)
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
  
    log('rolling from ', currentTick.toNumber(), 'to', endings[0])
  
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
  } finally {
    locked = false
  }
}