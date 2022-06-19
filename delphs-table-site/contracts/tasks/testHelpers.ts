import "@nomiclabs/hardhat-ethers"
import { utils, Wallet } from "ethers"
import { keccak256 } from "ethers/lib/utils"
import { task } from 'hardhat/config'
import { getDelphsTableContract, getDeployer, getPlayerContract } from "./helpers"


function hashString(msg:string) {
  return keccak256(Buffer.from(msg))
}

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