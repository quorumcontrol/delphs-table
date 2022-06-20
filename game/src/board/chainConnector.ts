import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";

import { skaleTestnet } from "../utils/SkaleChains";
import { BigNumber, BytesLike, constants, ethers } from "ethers";
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

  inProgress?:Promise<any>

  started = false;
  startedAt?: BigNumber;

  private tableId?:string

  latest: BigNumber;

  initialize() {
    log("chain connector initialized");
    this.handleTick = this.handleTick.bind(this);
    this.asyncHandleTick = this.asyncHandleTick.bind(this);
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
      this.tableId = tableId
      const [table, players, latest] = await Promise.all([
        this.delphs.tables(tableId),
        this.delphs.players(tableId),
        this.delphs.latestRoll(),
      ]);
      log("table", table, 'latest', latest, 'players', players);

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

      if (latest.gte(table.startedAt)) {
        log("table has already started, lets catch up");
        this.startedAt = table.startedAt;
        await this.catchUp(table.startedAt, latest);
      }

      log("setting up event filters", this.delphs.filters.Started(tableId));

      this.delphs.on(this.delphs.filters.Started(tableId, null), this.handleStarted);
      this.delphs.on(this.delphs.filters.DiceRolled(null, null, null), this.handleTick);
    } catch (err) {
      console.error("error", err);
      throw err;
    }
  }

  // start and end are inclusive
  async catchUp(start: BigNumber, end: BigNumber) {
    log("catching up", start.toString(), end.toString());
    const missing = await Promise.all(
      Array(end.sub(start).add(1).toNumber())
        .fill(true)
        .map((_, i) => {
          return this.delphs.rolls(start.add(i));
        })
    );
    log("missing: ", missing);
    missing.forEach((roll, i) => {
      this.handleTick(start.add(i), constants.Zero, roll);
    });
  }

  private handleTick(
    index: BigNumber,
    _blockNumber: BigNumber,
    random: BytesLike,
    evt?: DiceRolledEvent
  ) {
    log("tick: ", index.toString(), evt);
    if (this.inProgress) {
      this.inProgress = this.inProgress.finally(() => {
        return this.asyncHandleTick(index, random)
      })
      return
    }
    this.inProgress = this.asyncHandleTick(index, random)
  }

  private async asyncHandleTick(
    index: BigNumber,
    random: BytesLike,
  ) {
    try {
      if (!this.tableId) {
        throw new Error('weird state: no table id but handling ticks')
      }
      log("async tick: ", index.toString());
      if (this.latest?.gte(index)) {
        console.error('reprocessing old event: ', index.toString())
        return
      }
      if (this.startedAt && index.gte(this.startedAt)) {
        if (this.latest && index.gt(this.latest.add(1))) {
          log('latest: ', this.latest)
          await this.catchUp(this.latest.add(1), index)
        }
  
        if (!this.started) {
          log("starting the game");
          this.started = true;
          this.grid.start(random);
          this.entity.fire("start");
        }

        // get the destinations for the roll
        const destinations = await this.delphs.destinationsForRoll(this.tableId, index)
        destinations.forEach((dest) => {
          const warrior = this.grid.warriors.find((w) => w.id === dest.player)
          if (!warrior) {
            throw new Error('bad warrior id')
          }
          warrior.destination = [dest.x.toNumber(), dest.y.toNumber()]
        })
        this.entity.fire("tick", this.grid.handleTick(random));
        this.latest = index;
      }
    } catch (err) {
      console.error('error handling async tick: ', err)
      return
    }
  }

  handleStarted(_tableId: string, startedAt: BigNumber, evt?: StartedEvent) {
    log("received starting event", evt, "setting started at to ");
    this.startedAt = startedAt;
  }
}

export default ChainConnector;
