
import { providers, Wallet } from "ethers";
import debug, { Debugger } from 'debug'
import { skaleTestnet } from '../src/utils/SkaleChains'
import { keccak256 } from "ethers/lib/utils";
import { faker } from '@faker-js/faker'
import { NonceManager } from '@ethersproject/experimental'
import botSetup from '../contracts/bots'
import { OrchestratorState__factory } from "../contracts/typechain";
import { addresses } from "../src/utils/networks";
import { delphsContract, lobbyContract, playerContract } from "../src/utils/contracts";
import promiseWaiter from '../src/utils/promiseWaiter'
import * as dotenv from "dotenv";

dotenv.config({
  path: '.env.local'
})

if (!process.env.env_delphsPrivateKey) {
  console.error('no private key')
  throw new Error("must have a DELPHS private key")
}

function hashString(msg: string) {
  return keccak256(Buffer.from(msg))
}

async function getBots(num: number) {
  const botNames = Object.keys(botSetup)
  return botNames.slice(0, num).map((name) => {
    return {
      name,
      ...botSetup[name]
    }
  })
}

const provider = new providers.StaticJsonRpcProvider(skaleTestnet.rpcUrls.default)

const wallet = new NonceManager(new Wallet(process.env.env_delphsPrivateKey!).connect(provider))

const lobby = lobbyContract(wallet, provider)
const delphs = delphsContract(wallet, provider)
const player = playerContract(provider)
const orchestratorState = OrchestratorState__factory.connect(addresses().OrchestratorState, wallet)

class TableMaker {
  timeoutHandle?: ReturnType<typeof setTimeout>
  log: Debugger

  constructor() {
    this.log = debug('table-maker')
  }

  handleLobbyRegistration() {
    this.log('lobby registration, waiting')
    if (!this.timeoutHandle) {
      this.timeoutHandle = setTimeout(() => {
        this.timeoutHandle = undefined
        this.makeTable().then((resp) => {
          console.log('table made')
        }).catch((err) => {
          console.error('error making table:', err)
          this.handleLobbyRegistration()
        })
      }, 30000)
    }
  }

  private async makeTable() {
    try {
      this.log('make table')

      const waiting = await lobby.waitingAddresses()
      if (waiting.length === 0) {
        this.log('no one is waiting')
        return
      }
      const rounds = 100

      const botNumber = Math.max(10 - waiting.length, 0)
      const id = hashString(`${faker.company.companyName()}: ${faker.company.bs()}}`)

      const playersWithNamesAndSeeds = (await Promise.all(waiting.concat((await getBots(botNumber)).map((b) => b.address)).map(async (address) => {
        const name = await player.name(address)
        if (!name) {
          this.log(`${address} has no name`)
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

      const tx = await delphs.createAndStart(id, playersWithNamesAndSeeds.map((p) => p.address!), playersWithNamesAndSeeds.map((p) => p.seed), rounds, await wallet.getAddress(), { gasLimit: 1500000})
      this.log('table id: ', id, 'tx: ', tx.hash)
      // on staging we do not have mtm
      await orchestratorState.add(id)
      await lobby.takeAddresses(waiting, id)
      await tx.wait()

      this.log('done')
    } catch (err) {
      console.error('error making table: ', err)
      this.handleLobbyRegistration()
    }
  }
}

class TablePlayer {

  log: Debugger
  private pending?: Promise<any>

  constructor() {
    this.log = debug('table-player')
  }

  handleTableStarted() {
    this.log('table started, waiting')
    const lookForTablesPromise = () => {
      return new Promise(async (outerResolve) => {
        await new Promise((timerResolve) => {
          setTimeout(timerResolve, 15000)
        })
        outerResolve(this.playTables())
      })
    }
    if (this.pending) {
      return this.pending = this.pending.finally(lookForTablesPromise).catch((err) => console.error('error playing table: ', err))
    }
    this.pending = lookForTablesPromise()
  }

  private async playTables() {
    try {
      this.log('play tables')
      const ids = await orchestratorState.all()
      if (ids.length === 0) {
        this.log('no tables')
        return
      }
      const active = await Promise.all((ids).map(async (tableId) => {
        this.log('active: ', tableId)
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

      this.log('rolling from ', currentTick.toNumber(), 'to', endings[0].toNumber())

      for (let i = 0; i < endings[0].sub(currentTick).toNumber(); i++) {
        this.log('roll')
        const tx = await delphs.rollTheDice({ gasLimit: 250000 })
        this.log('rolled: ', tx.hash)
        await tx.wait()
        await promiseWaiter(2000)
      }
      this.log('bulk remove')
      await orchestratorState.bulkRemove(active.map((table) => table.id), { gasLimit: 500000 })
      this.log('rolling complete')
    } catch (err) {
      console.error('error rolling: ', err)
      this.handleTableStarted()
    }
  }
}

async function main() {
  return new Promise((_resolve) => {
    console.log('running')

    const tableMaker = new TableMaker()
    const tablePlayer = new TablePlayer()

    debug.enable('table-player,table-maker')

    const lobbyRegistrationFilter = lobby.filters.RegisteredInterest(null)
    const orchestratorFilter = orchestratorState.filters.TableAdded(null)

    provider.on(lobbyRegistrationFilter, () => tableMaker.handleLobbyRegistration())
    provider.on(orchestratorFilter, () => tablePlayer.handleTableStarted())
    // at startup, just check for any running tables
    tablePlayer.handleTableStarted()
    // and if any tables need to be created
    tableMaker.handleLobbyRegistration()
  })
}

main()
