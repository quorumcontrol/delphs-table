
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

  const waiting = await lobby.waitingAddresses()
  const rounds = 100

  const botNumber = Math.max(10 - waiting.length, 0)
  const id = hashString(`${faker.company.companyName()}: ${faker.company.bs()}}`)

  const playersWithNamesAndSeeds = (await Promise.all(waiting.concat((await getBots(botNumber)).map((b) => b.address)).map(async (address) => {
    const name = await player.name(address)
    if (!name) {
      console.log(`${address} has no name`)
      return null
    }
    return {
      name,
      address
    }
  })))
    .filter((p) => !!p)
    .map((p) => {
      return {
        ...p,
        seed: hashString(`${id}-${player!.name}-${player!.address}`)
      }
    })

  const tx = await delphs.createAndStart(id, playersWithNamesAndSeeds.map((p) => p.address!), playersWithNamesAndSeeds.map((p) => p.seed), rounds, wallet.address)
  console.log('table id: ', id, 'tx: ', tx.hash)
  await tx.wait()
  await (await lobby.takeAddresses(waiting, id)).wait()
  await orchestratorState.add(id)
  console.log('done')

  return callback(null, {
    statusCode: 201,
    body: JSON.stringify({
      message: 'ok',
      transactionId: tx.hash,
      tableId: id,
    }),
  })
}