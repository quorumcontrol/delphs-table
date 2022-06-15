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
    const DiceRollerFactory = await ethers.getContractFactory("TestDiceRoller");
    const diceRoller = await DiceRollerFactory.deploy();
    await diceRoller.deployed();
    const DelphsTableFactory = await ethers.getContractFactory("DelphsTable");
    delphsTable = await DelphsTableFactory.deploy(diceRoller.address, deployer.address)
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
  })
});
