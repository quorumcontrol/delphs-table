import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";

import { skaleTestnet } from "../utils/SkaleChains";
import { BigNumber, BytesLike, ethers } from "ethers";
import { DelphsTable, DelphsTable__factory, Player, Player__factory } from "../typechain";
import Warrior from "../boardLogic/Warrior";
import Grid from "../boardLogic/Grid";
import BoardGenerate from "./BoardGenerate";
import { DiceRolledEvent, StartedEvent } from "../typechain/DelphsTable";

const log = console.log; //debug('chainConnector')

const DELPHS_TESTNET_ADDRESS = "0x44b07581910b6CD9289AC06CFEDB89A275Ce9b7E";
const PLAYER_TESTNET_ADDRESS = "0x0710E6e9869cEbc2666af31c89602dC0f9ffB663";

@createScript("chainConnector")
class ChainConnector extends ScriptTypeBase {
  provider: ethers.providers.WebSocketProvider;
  delphs: DelphsTable;
  player: Player;
  grid: Grid;

  started = false;
  startedAt?: BigNumber;

  initialize() {
    log("chain connector initialized");
    this.handleTick = this.handleTick.bind(this);
    this.handleStarted = this.handleStarted.bind(this);
    this.provider = new ethers.providers.WebSocketProvider(skaleTestnet.rpcUrls.wss);
    this.delphs = DelphsTable__factory.connect(DELPHS_TESTNET_ADDRESS, this.provider);
    this.player = Player__factory.connect(PLAYER_TESTNET_ADDRESS, this.provider);
    this.asyncSetup();
  }

  async asyncSetup() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tableId = urlParams.get("tableId");
      if (!tableId) {
        log("no table id");
        return;
      }
      const table = await this.delphs.tables(tableId);
      log("table", table);
      const players = await this.delphs.players(tableId);
      log("players: ", players);
      const stats = await Promise.all(
        players.map(async (addr) => {
          return this.delphs.statsForPlayer(tableId, addr);
        })
      );
      log("stats", stats);
      const names = await Promise.all(
        players.map(async (addr) => {
          return this.player.name(addr);
        })
      );
      log("names", names);

      const warriors = players.map((p, i) => {
        const warriorStats = stats[i];
        const name = names[i];
        if (!name || !warriorStats) {
          throw new Error("weirdness, non matching lengths");
        }
        return new Warrior({
          id: p,
          name: name,
          attack: warriorStats.attack.toNumber(),
          defense: warriorStats.defense.toNumber(),
          initialHealth: warriorStats.health.toNumber(),
        });
      });
      log("warriors: ", warriors);
      const grid = new Grid({
        warriors,
        seed: "nonsense",
        sizeX: 10,
        sizeY: 10,
      });
      this.grid = grid;

      const boardGenerate = this.getScript<BoardGenerate>(this.entity, "boardGenerate");
      if (!boardGenerate) {
        throw new Error("no board generate");
      }
      boardGenerate.setGrid(grid);
      log("setting up event filters", this.delphs.filters.Started(tableId));
      this.delphs.on(this.delphs.filters.Started(tableId, null), this.handleStarted);
      this.delphs.on(this.delphs.filters.DiceRolled(null, null, null), this.handleTick);
    } catch (err) {
      console.error("error", err);
      throw err;
    }
  }

  handleTick(_index:BigNumber, _blockNumber:BigNumber, random:BytesLike, evt:DiceRolledEvent) {
    log("got tick: ", evt);
    if (this.startedAt && evt.args.index.gte(this.startedAt)) {
      if (!this.started) {
        log('starting the game')
        this.started = true;
        this.grid.start(random)
        this.entity.fire('start')
      }
      
      this.entity.fire('tick', this.grid.handleTick(random));
    }
  }

  handleStarted(tableId:string, startedAt:BigNumber, evt:StartedEvent) {
    log('received starting event', evt, 'setting started at to ')
    this.startedAt = startedAt;
  }
}

export default ChainConnector;
