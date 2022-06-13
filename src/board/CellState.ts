import { Entity, GraphNode } from "playcanvas";
import Battle from "../boardLogic/Battle";
import Cell from "../boardLogic/Cell";
import Warrior from "../boardLogic/Warrior";
import Wootgump from "../boardLogic/Wootgump";
import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";
import mustFindByName from "../utils/mustFindByName";
import { randomBounded } from "../utils/randoms";
import BattleUI from "./BattleUI";
import PlayerMarker from "./PlayerMarker";

@createScript("cellState")
class CellState extends ScriptTypeBase {
  xSize: number;
  zSize: number;
  playerMarkerTemplate: GraphNode; // for now
  wootGumpTemplate: GraphNode; // for now
  battleTemplate: GraphNode

  cell?: Cell;
  playerMarkers: { [key: string]: Entity };
  gumps: { [key: string]: Entity };
  battles: { [key: string]: Entity };

  initialize() {
    this.handleTick = this.handleTick.bind(this);
    if (!this.entity.render) {
      throw new Error("no render");
    }
    const tileBoundingBox = this.entity.render.meshInstances[0].aabb;
    this.xSize = tileBoundingBox.halfExtents.x * 0.8;
    this.zSize = tileBoundingBox.halfExtents.z * 0.8;

    const templates = mustFindByName(this.app.root, "Templates");
    this.playerMarkerTemplate = mustFindByName(templates, "PlayerMarker");
    this.wootGumpTemplate = mustFindByName(templates, "Wootgump");
    this.battleTemplate = mustFindByName(templates, "Battle");
    this.playerMarkers = {};
    this.gumps = {};
    this.battles = {}
    this.entity.parent.on("tick", this.handleTick);
  }

  handleTick() {
    this.stateUpdate();
  }

  setCell(cell: Cell) {
    this.cell = cell;
    this.stateUpdate();
  }

  stateUpdate() {
    if (!this.cell) {
      throw new Error("no cell assigned");
    }
    this.updateWarriors();
    this.updateGump();
    this.updateBattles();
  }

  private updateBattles() {
    if (!this.cell) {
      throw new Error("trying to update cellSTate with no cell");
    }
    const cellIds = this.cell.battles.map((b) => b.battleId());
    const uiIds = Object.keys(this.battles);
    // first delete anything that's not there anymore
    uiIds
      .filter((id) => !cellIds.includes(id))
      .forEach((id) => {
        try {
          if ( this.battles[id]) {
            const battleUIScript = this.getScript<BattleUI>(this.battles[id], 'battleUI')
            battleUIScript?.destroy();
            delete this.battles[id];
          }
        } catch (err) {
          console.error("error: ", err);
          throw err;
        }
      });
      this.cell.battles.forEach((battle) => {
          if (!this.battles[battle.battleId()]) {
            this.placeBattle(battle);
          }
      });
  }

  private placeBattle(battle:Battle) {
    const battleElement = this.battleTemplate.clone();
    this.entity.addChild(battleElement);

    const rndX = randomBounded(this.xSize * 0.5);
    const rndZ = randomBounded(this.zSize * 0.5);
    battleElement.setLocalScale(0.5, 0.5, 0.5);

    battleElement.setLocalPosition(rndX, 0.5, rndZ);
    battleElement.setRotation(0, randomBounded(0.2), 0, 1);
    this.battles[battle.battleId()] = battleElement as Entity;
    const battleUIScript = this.getScript<BattleUI>(battleElement as Entity, 'battleUI')
    battleUIScript?.setBattle(battle)
  }

  private updateWarriors() {
    if (!this.cell) {
      throw new Error("trying to update cellSTate with no cell");
    }
    const cellIds = this.cell.nonBattlingWarriors().map((w) => w.id);
    const uiIds = Object.keys(this.playerMarkers);
    // first delete anything that's not there anymore
    uiIds
      .filter((id) => !cellIds.includes(id))
      .forEach((id) => {
        try {
          if ( this.playerMarkers[id]) {
            this.playerMarkers[id].destroy();
            delete this.playerMarkers[id];
          }
        } catch (err) {
          console.error("error: ", err);
          throw err;
        }
      });

    this.cell.nonBattlingWarriors().forEach((warrior) => {
      try {
        if (!this.playerMarkers[warrior.id]) {
          this.placeWarrior(warrior);
        }
      } catch (err) {
        console.error("err: ", err);
        throw err;
      }
    });
  }

  private updateGump() {
    if (!this.cell) {
      throw new Error("trying to update cellSTate with no cell");
    }
    const cellIds = this.cell.wootgump.map((w) => w.id);
    const uiIds = Object.keys(this.gumps);
    // first delete anything that's not there anymore
    uiIds
      .filter((id) => !cellIds.includes(id))
      .forEach((id) => {
        try {
          this.gumps[id].destroy();
          delete this.gumps[id];
        } catch (err) {
          console.error("error: ", err);
          throw err;
        }
      });

    this.cell.wootgump.forEach((gump) => {
      try {
        if (!this.gumps[gump.id]) {
          this.placeGump(gump);
        }
      } catch (err) {
        console.error("err: ", err);
        throw err;
      }
    });
  }

  private placeGump(wootGump: Wootgump) {
    const gumpElement = this.wootGumpTemplate.clone();
    this.entity.addChild(gumpElement);

    const rndX = randomBounded(this.xSize);
    const rndZ = randomBounded(this.zSize);
    gumpElement.setLocalScale(0.1, 5, 0.1);

    gumpElement.setLocalPosition(rndX, 0, rndZ);
    gumpElement.setRotation(0, randomBounded(0.2), 0, 1);
    this.gumps[wootGump.id] = gumpElement as Entity;
  }

  private placeWarrior(warrior: Warrior) {
    const playerMarker = this.playerMarkerTemplate.clone();
    playerMarker.name = `${this.cell?.x}-${this.cell?.y}-marker-${warrior.id}`;

    this.entity.addChild(playerMarker);
    this.getScript<PlayerMarker>(playerMarker as Entity, 'playerMarker')?.setWarrior(warrior)

    playerMarker.setLocalScale(0.05, 5, 0.05);
    const rndX = randomBounded(this.xSize);
    const rndZ = randomBounded(this.zSize);

    playerMarker.setLocalPosition(rndX, 5, rndZ);
    playerMarker.setRotation(0, randomBounded(0.2), 0, 1);
    this.playerMarkers[warrior.id] = playerMarker as Entity;
    return playerMarker;
  }
}

export default CellState;
