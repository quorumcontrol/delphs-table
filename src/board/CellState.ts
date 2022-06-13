import { Entity, GraphNode } from "playcanvas";
import Cell from "../boardLogic/Cell";
import Warrior from "../boardLogic/Warrior";
import Wootgump from "../boardLogic/Wootgump";
import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";
import { randomBounded } from "../utils/randoms";

@createScript("cellState")
class CellState extends ScriptTypeBase {
  xSize: number;
  zSize: number;
  playerMarkerTemplate: GraphNode; // for now
  wootGumpTemplate: GraphNode; // for now

  cell?: Cell;
  playerMarkers: { [key: string]: Entity };
  gumps: { [key: string]: Entity };

  initialize() {
    this.handleTick = this.handleTick.bind(this);
    if (!this.entity.render) {
      throw new Error("no render");
    }
    const tileBoundingBox = this.entity.render.meshInstances[0].aabb;
    this.xSize = tileBoundingBox.halfExtents.x * 0.8;
    this.zSize = tileBoundingBox.halfExtents.z * 0.8;
    const templates = this.app.root.findByName("Templates");
    if (!templates) {
      throw new Error("no templates");
    }
    const playerMarker = templates.findByName("PlayerMarker");
    if (!playerMarker) {
      throw new Error("no player marker");
    }
    const wootGumpTemplate = templates.findByName("Wootgump");
    if (!wootGumpTemplate) {
      throw new Error("no wootgump template");
    }
    this.wootGumpTemplate = wootGumpTemplate;
    this.playerMarkerTemplate = playerMarker;
    this.playerMarkers = {};
    this.gumps = {};
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
  }

  private updateWarriors() {
    if (!this.cell) {
      throw new Error("trying to update cellSTate with no cell");
    }
    const cellIds = this.cell.warriors.map((w) => w.id);
    const uiIds = Object.keys(this.playerMarkers);
    // first delete anything that's not there anymore
    uiIds
      .filter((id) => !cellIds.includes(id))
      .forEach((id) => {
        try {
          this.playerMarkers[id].destroy();
          delete this.playerMarkers[id];
        } catch (err) {
          console.error("error: ", err);
          throw err;
        }
      });

    this.cell.warriors.forEach((warrior) => {
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

    gumpElement.setLocalPosition(rndX, 5, rndZ);
    gumpElement.setRotation(0, randomBounded(0.2), 0, 1);
    this.gumps[wootGump.id] = gumpElement as Entity;
    console.log(this.cell?.x, this.cell?.y, "placed gump")
  }

  private placeWarrior(warrior: Warrior) {
    const playerMarker = this.playerMarkerTemplate.clone();
    playerMarker.name = `${this.cell?.x}-${this.cell?.y}-marker-${warrior.id}`;
    const name = playerMarker.findByName("Name") as Entity;
    if (!name.element) {
      throw new Error("no element");
    }
    name.element.text = warrior.name;
    this.entity.addChild(playerMarker);
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
