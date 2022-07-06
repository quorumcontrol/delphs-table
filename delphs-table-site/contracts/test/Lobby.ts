import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { Lobby } from "../typechain";

describe("Lobby", function () {
  let lobby:Lobby
  let signers:SignerWithAddress[]

  beforeEach(async () => {
    signers = await ethers.getSigners()
    const deployer = signers[0]

    const PlayerFactory = await ethers.getContractFactory('Player');
    const player = await PlayerFactory.deploy()
    await player.deployed()
    await player.initializePlayer('deployer', deployer.address);

    const LobbyFactory = await ethers.getContractFactory("Lobby");
    lobby = await LobbyFactory.deploy(player.address, deployer.address);
    await lobby.deployed();
  })

  it("registers interest", async () => {
    const alice = signers[1]
    await expect(lobby.connect(alice).registerInterest()).to.not.be.reverted
    expect(await lobby.waitingAddresses()).to.have.members([alice.address])
  });

  it('can take addresses to play', async () => {
    const alice = signers[1]
    await lobby.connect(alice).registerInterest()
    await expect(lobby.takeAddresses([alice.address], keccak256(Buffer.from('this would be table id')))).to.not.be.reverted
    expect(await lobby.waitingAddresses()).to.have.lengthOf(0)
  })
});
