import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { DelphsTable, DiceRoller } from "../typechain";

function hashString(msg:string) {
 return ethers.utils.keccak256(ethers.utils.solidityPack(['string'], [msg]))
}

describe("DelphsTable", function () {
  let delphsTable:DelphsTable
  let deployer:SignerWithAddress

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    deployer = signers[0]
    const PlayerFactory = await ethers.getContractFactory('Player');
    const player = await PlayerFactory.deploy()
    await player.deployed()
    await player.initializePlayer('deployer', deployer.address);

    const DiceRollerFactory = await ethers.getContractFactory("TestDiceRoller");
    const diceRoller = await DiceRollerFactory.deploy();
    await diceRoller.deployed();
    const DelphsTableFactory = await ethers.getContractFactory("DelphsTable");
    delphsTable = await DelphsTableFactory.deploy(diceRoller.address, player.address, deployer.address)
    await delphsTable.deployed()
  })

  describe('game', () => {
    const id = hashString('testgame')
    beforeEach(async () => {
      await expect(delphsTable.createTable(id, [deployer.address], [hashString('test')], 2, deployer.address)).to.not.be.reverted
    })

    it('can start', async () => {
      await expect(delphsTable.start(id)).to.not.be.reverted
    })

    it('correctly sets the table', async () => {
      const table = await delphsTable.tables(id)
      expect(table.gameLength).to.equal(2)
    })

    it('sets the players', async () => {
      expect(await delphsTable.players(id)).to.have.members([deployer.address]).and.lengthOf(1)
    })

    it('gets onchain stats for the players', async () => {
      await delphsTable.start(id)
      await delphsTable.rollTheDice()
      const stats = await delphsTable.statsForPlayer(id, deployer.address)
      expect(stats.attack.gt(0)).to.be.true
      expect(stats.defense.gt(0)).to.be.true
      expect(stats.health.gt(0)).to.be.true
    })

    it('sets destinations for players', async () => {
      await delphsTable.start(id)
      await delphsTable.rollTheDice()
      await delphsTable.setDestination(id, -1, 2);
      const startedAt = (await delphsTable.tables(id)).startedAt
      const dests = await delphsTable.destinationsForRoll(id, await delphsTable.latestRoll())
      expect(dests).to.have.lengthOf(1)
      expect(dests[0].x).to.equal(-1)
      expect(dests[0].y).to.equal(2)
      expect(dests[0].player).to.equal(deployer.address)
    })
  })
});
