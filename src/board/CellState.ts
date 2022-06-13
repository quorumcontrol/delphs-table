import { Entity, GraphNode } from "playcanvas";
import Cell from "../boardLogic/Cell";
import Warrior from "../boardLogic/Warrior";
import Wootgump from "../boardLogic/Wootgump";
import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript, attrib } from "../utils/createScriptDecorator";
import { randomBounded } from "../utils/randoms";

@createScript("cellState")
class CellState extends ScriptTypeBase {
  xSize: number;
  zSize: number;
  playerMarkerTemplate: GraphNode; // for now
  wootGumpTemplate: GraphNode; // for now

  cell?: Cell;
  playerMarkers: { [key: string]: GraphNode } = {};
  gumps: { [key: string]: GraphNode } = {};

  initialize() {
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
  }

  setCell(cell: Cell) {
    this.cell = cell;
    this.stateUpdate();
  }

  stateUpdate() {
    if (!this.cell) {
      throw new Error("no cell assigned");
    }
    for (const warrior of this.cell.warriors) {
      this.placeWarrior(warrior);
    }
    for (const gump of this.cell.wootgump) {
      this.placeGump(gump);
    }
  }

  placeGump(wootGump: Wootgump) {
    const gumpElement = this.wootGumpTemplate.clone();
    this.entity.addChild(gumpElement);

    const rndX = randomBounded(this.xSize);
    const rndZ = randomBounded(this.zSize);

    gumpElement.setLocalPosition(rndX, 5, rndZ);
    gumpElement.setRotation(0, randomBounded(0.2), 0, 1);
    this.gumps[wootGump.id] = gumpElement;
  }

  placeWarrior(warrior: Warrior) {
    const playerMarker = this.playerMarkerTemplate.clone();
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
    this.playerMarkers[warrior.id] = playerMarker;
  }
}

export default CellState;
