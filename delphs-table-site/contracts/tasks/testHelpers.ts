import "@nomiclabs/hardhat-ethers"
import { utils, Wallet } from "ethers"
import { keccak256 } from "ethers/lib/utils"
import { task } from 'hardhat/config'
import { getDelphsTableContract, getDeployer, getPlayerContract } from "./helpers"


function hashString(msg:string) {
  return keccak256(Buffer.from(msg))
}

task('start')
  .addParam('id')
  .setAction(async ({ id }, hre) => {
    const delphs = await getDelphsTableContract(hre)
    const tx = await delphs.start(id)
    console.log('tx', tx.hash)
    await tx.wait()
  })

task('tick')
  .setAction(async (_, hre) => {
    const delphs = await getDelphsTableContract(hre)
    const start = new Date()
    const tx = await delphs.rollTheDice()
    console.log('tx', tx.hash)
    await tx.wait()
    console.log('time: ', (new Date().getTime() - start.getTime())/1000)
  })

task('setup-bots', async (_,hre) => {
  const deployer = await getDeployer(hre)
  const player = await getPlayerContract(hre)
  const names = [
    'Lawrence29',
    'Buddy79',
    'Lera_Christiansen',
    'Rigoberto.Maggio97',
    'Tad_Willms81',
    'Marielle50',
    'Ken_Kuhlman13',
    'Vinnie93',
    'Raven20',
    'Joannie_Balistreri'
  ]
  const wallets = names.map((name) => {
    return {
      name,
      wallet: Wallet.createRandom(),
    }
  })
  for (const wallet of wallets) {
    const addr = await wallet.wallet.getAddress()
    await deployer.sendTransaction({
      to: addr,
      value: utils.parseEther('0.1')
    })
    await player.connect(wallet.wallet.connect(hre.ethers.provider)).initializePlayer(wallet.name, addr)
  }

  console.log(wallets.reduce((memo, wallet) => {
    return {
      ...memo,
      [wallet.name]: {
        pk: wallet.wallet.privateKey,
        address: wallet.wallet.address
      }
    }
  }, {} as {[key:string]:any}))
  
})

async function getBots(num:number) {
  const { default: botSetup } = await import('../bots')
  const botNames = Object.keys(botSetup)
  return botNames.slice(0, num).map((name) => {
    return {
      name,
      ...botSetup[name]
    }
  })
}

task('player')
  .addParam('addr')
  .setAction(async ({ addr }, hre) => {
    const player = await getPlayerContract(hre)
    console.log(await player.name(addr))
  })

task('run-game')
  .addParam('id')
  .setAction(async ({ id }, hre) => {
    const delphs = await getDelphsTableContract(hre)
    const table = await delphs.tables(id)
    const started = table.startedAt
    const len = table.gameLength
    const latest = await delphs.latestRoll()
    const remaining = len.sub(latest.sub(started)).toNumber()
    for (let i = 0; i < remaining; i++) {
      const tx = await delphs.rollTheDice()
      console.log('dice roll: ', tx.hash)
      await tx.wait()
      console.log('ok')
    }
    console.log('done')
  })

task('board')
  .addParam('name')
  .addParam('addresses')
  .addOptionalParam('bots', 'number of bots to add to the board')
  .addOptionalParam('rounds', 'number of rounds')
  .setAction(async ({ name, addresses, bots:userBots, rounds:userRounds }, hre) => {

    const rounds = userRounds ? parseInt(userRounds, 10) : 50
    const botNumber = userBots ? parseInt(userBots, 10) : 0
    const delphs = await getDelphsTableContract(hre)
    const deployer = await getDeployer(hre)
    const player = await getPlayerContract(hre)

    const isOk = await Promise.all(addresses.split(',').map((addr:string) => {
      return player.isInitialized(addr)
    }))

    isOk.forEach((is, i) => {
      if (!is) {
        console.error(`Uninitilized: ${addresses.split(',')[i]}`)
        throw new Error('address is not initialized')
      }
    })

    const tableAddrs:string[] = addresses.split(',').concat((await getBots(botNumber)).map((bot) => bot.address as string))
    const seeds = tableAddrs.map((addr) => hashString(`${name}-${addr}`))

    const id = hashString(name)
    await (await delphs.createTable(id, tableAddrs, seeds, rounds, deployer.address)).wait()
    console.log('table id: ', id)
  })

task('test-board')
  .addParam('name')
  .setAction(async ({ name }, hre) => {
    const smallFuel = utils.parseEther('0.01')

    const player1 = Wallet.createRandom().connect(hre.ethers.provider)
    const player2 = Wallet.createRandom().connect(hre.ethers.provider)

    const deployer = await getDeployer(hre)
    const tx1 = await deployer.sendTransaction({
      to: player1.address,
      value: smallFuel
    })
    const tx2 = await deployer.sendTransaction({
      to: player2.address,
      value: smallFuel
    })

    await Promise.all([
      tx1.wait(),
      tx2.wait()
    ])
  
    console.log(`
    player1: ${await player1.getAddress()} ${player1.privateKey}
    player2: ${await player2.getAddress()} ${player2.privateKey}
    `)
  
    const player = await getPlayerContract(hre)
    await player.connect(player1).initializePlayer(`${name} - 1`, player1.address)
    await player.connect(player2).initializePlayer(`${name} - 2`, player2.address)

    const delphs = await getDelphsTableContract(hre)
    const id = hashString(name)
    await (await delphs.createTable(id, [player1.address, player2.address], [hashString(`1-${name}`), hashString(`2-${name}`)], 60, deployer.address)).wait()
    console.log('table id: ', id)
  })