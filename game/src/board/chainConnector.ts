import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";

import { skaleTestnet } from "../utils/SkaleChains"
import { ethers } from "ethers";
import { DelphsTable, DelphsTable__factory, Player, Player__factory } from "../typechain";

const log = console.log //debug('chainConnector')

const DELPHS_TESTNET_ADDRESS = '0x866cF408950b998AA9bf9F889fbf4380506b188c'
const PLAYER_TESTNET_ADDRESS = '0x0710E6e9869cEbc2666af31c89602dC0f9ffB663'

@createScript("chainConnector")
class ChainConnector extends ScriptTypeBase {

  provider:ethers.providers.WebSocketProvider
  delphs:DelphsTable
  player:Player

  initialize() {
    log('chain connector initialized')

    this.provider = new ethers.providers.WebSocketProvider(skaleTestnet.rpcUrls.wss)
    this.delphs = DelphsTable__factory.connect(DELPHS_TESTNET_ADDRESS, this.provider)
    this.player = Player__factory.connect(PLAYER_TESTNET_ADDRESS, this.provider)
    this.asyncSetup()
  }

  async asyncSetup() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tableId = urlParams.get("tableId")
      if (!tableId) {
        log('no table id')
        return
      }
      const table = await this.delphs.tables(tableId)
      log('table', table)
      const players = await this.delphs.players(tableId)
      log('players: ', players)
      const stats = await Promise.all(players.map(async (addr) => {
        return this.delphs.statsForPlayer(tableId, addr)
      }))
      log('stats', stats)
      const names = await Promise.all(players.map(async (addr) => {
        return this.player.name(addr)
      }))
      log('names', names)
    } catch (err) {
      console.error('error')
    }
  }



}

export default ChainConnector
