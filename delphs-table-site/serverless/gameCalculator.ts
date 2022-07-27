
import { providers, Wallet } from "ethers";
import debug from 'debug'
import { skaleTestnet } from '../src/utils/SkaleChains'
import { delphsContract, playerContract } from "../src/utils/contracts";
import GamePlayer from "./gamePlayer";

const log = debug('tableMaker')
debug.enable('*')

if (!process.env.env_delphsPrivateKey) {
  throw new Error("must have a DELPHS private key")
}


const provider = new providers.StaticJsonRpcProvider(skaleTestnet.rpcUrls.default)

const wallet = new Wallet(process.env.env_delphsPrivateKey!).connect(provider)

const delphs = delphsContract(wallet, provider)
const player = playerContract(provider)

export async function handle(event:any, _context:any, callback:any) {
  const { tableId }: { tableId:string } = JSON.parse(event.body)

  const gamePlayer = new GamePlayer({
    delphs,
    player,
    tableId
  })

  await gamePlayer.run()

  console.log('done!')

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'ok',
      // transactionId: tx.hash,
      // tableId: id,
    }),
  })
}