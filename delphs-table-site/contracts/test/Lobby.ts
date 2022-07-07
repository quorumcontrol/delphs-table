import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { utils, Wallet } from "ethers";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { Lobby, Player } from "../typechain";

describe("Lobby", function () {
  let lobby:Lobby
  let player:Player
  let signers:SignerWithAddress[]

  beforeEach(async () => {
    signers = await ethers.getSigners()
    const deployer = signers[0]

    const PlayerFactory = await ethers.getContractFactory('Player');
    player = await PlayerFactory.deploy()
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

  it.only('registers interest when the sender is a device', async () => {
    const alice = signers[1]
    const wallet = Wallet.createRandom().connect(ethers.provider)
    await alice.sendTransaction({to: await wallet.getAddress(), value: utils.parseEther('0.1')})
    await player.connect(alice).initializePlayer('test', wallet.address)
    await lobby.connect(wallet).registerInterest()
    expect(await lobby.waitingAddresses()).to.have.members([alice.address])
  })

  it('can take addresses to play', async () => {
    const alice = signers[1]
    await lobby.connect(alice).registerInterest()
    await expect(lobby.takeAddresses([alice.address], keccak256(Buffer.from('this would be table id')))).to.not.be.reverted
    expect(await lobby.waitingAddresses()).to.have.lengthOf(0)
  })
});
