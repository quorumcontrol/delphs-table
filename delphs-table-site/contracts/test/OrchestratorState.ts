import { expect } from "chai";
import { keccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { OrchestratorState } from "../typechain";

describe("OrchestratorState", function () {
  let orchestrator:OrchestratorState

  const bytes32 = keccak256(Buffer.from('test'))

  beforeEach(async () => {
    const deployer = (await ethers.getSigners())[0]
    const OrchestratorFactory = await ethers.getContractFactory("OrchestratorState");
    orchestrator = await OrchestratorFactory.deploy(deployer.address);
    await orchestrator.deployed();
  })

  it("adds", async () => {
    await expect(orchestrator.add(bytes32)).to.not.be.reverted
    expect(await orchestrator.all()).to.have.lengthOf(1)
    expect(await orchestrator.all()).to.have.members([bytes32])
  });

  it('removes', async () => {
    await expect(orchestrator.add(bytes32)).to.not.be.reverted
    expect(await orchestrator.all()).to.have.lengthOf(1)
    await expect(orchestrator.remove(bytes32)).to.not.be.reverted
    expect(await orchestrator.all()).to.have.lengthOf(0)
  })
});
