import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { Player } from "../typechain";

describe("Player", function () {
  let player:Player
  let alice:SignerWithAddress

  beforeEach(async () => {
    const Player = await ethers.getContractFactory("Player");
    player = await Player.deploy();
    await player.deployed();
    alice = (await ethers.getSigners())[1]
    player = player.connect(alice)
  })

  it("sets username after initialization", async () => {
    await player.initializePlayer('alice', alice.address);
    await player.setUsername('alice');
    expect(await player.name(alice.address)).to.eq('alice')
  });

  it('adds a device', async () => {
    const random = ethers.Wallet.createRandom()
    await player.addDevice(await random.getAddress());
    expect(await player.devices(alice.address, random.address)).to.be.true
  })

  it('removes a device', async () => {
    const random = ethers.Wallet.createRandom()
    await player.addDevice(await random.getAddress());
    await player.removeDevice(random.address)
    expect(await player.devices(alice.address, random.address)).to.be.false
  })

  it('sets initializes and maps the player to themselves', async () => {
    const random = ethers.Wallet.createRandom()
    await player.initializePlayer('alice', await random.getAddress());
    expect(await player.devices(alice.address, random.address)).to.be.true
    expect(await player.name(alice.address)).to.eq('alice')
    expect(await player.deviceToPlayer(alice.address)).to.eq(alice.address)
  })

  it('knows if a player is initalized', async () => {
    const random = ethers.Wallet.createRandom()

    expect(await player.isInitialized(alice.address)).to.be.false
    await player.initializePlayer('alice', await random.getAddress());
    expect(await player.isInitialized(alice.address)).to.be.true
  })

  it('transfers the call value to the device', async () => {
    const random = ethers.Wallet.createRandom()
    const one = utils.parseEther('1')

    expect(await player.isInitialized(alice.address)).to.be.false
    await player.initializePlayer('alice', await random.getAddress(), {value: one});
    expect(await player.isInitialized(alice.address)).to.be.true
    expect(await ethers.provider.getBalance(random.address)).to.equal(one)
  })

});
