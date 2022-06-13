import { generateFakeWarriors } from "../boardLogic/Warrior";
import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript, attrib } from "../utils/createScriptDecorator";
import Grid from "../boardLogic/Grid";
import Cell from "../boardLogic/Cell";
import { Entity, GraphNode } from "playcanvas";
import CellState from "./CellState";

@createScript("boardGenerate")
class BoardGenerate extends ScriptTypeBase {
  @attrib({ type: "number", default: 10 })
  numTilesX = 10;

  @attrib({ type: "number", default: 10 })
  numTilesY = 10;

  ground: GraphNode;
  grid: Grid;

  timer = 0;

  initialize() {
    this.initialCellSetup = this.initialCellSetup.bind(this);
    // We've created a couple of templates that are our world tiles
    // In the Editor hierarchy, we have disabled the templates because
    // we don't want them to be visible. We just want our generated
    // world to be visible
    const templates = this.app.root.findByName("Templates");
    if (!templates) {
      throw new Error("no templates");
    }
    const ground = templates.findByName("Tile");
    if (!ground) {
      throw new Error("no ground");
    }
    this.ground = ground;

    console.log("sizeX/sizeY: ", this.numTilesX, this.numTilesY);
    this.grid = new Grid({
      warriors: generateFakeWarriors(10, "test"),
      seed: "test",
      sizeX: this.numTilesX,
      sizeY: this.numTilesY,
    });

    this.grid.everyCell(this.initialCellSetup);
  }

  update(dt: number) {
    this.timer += dt;
    if (this.timer >= 4) {
      const tick = this.grid.doTick();
      console.log(tick);
      if (!this.entity.fire) {
        throw new Error('no fire method')
      }
      this.entity.fire("tick", tick);
      this.timer = 0;
    }
  }

  private initialCellSetup(cell: Cell) {
    const e = this.ground.clone();
    const cellStateScript = this.getScript<CellState>(e as Entity, "cellState");
    if (!cellStateScript) {
      throw new Error("no script");
    }
    // Set the world position of the cloned tile. Note that because
    // our tiles are 10x10 in X,Z dimensions, we have to multiply
    // the position by 10
    e.setPosition(
      (cell.x - this.numTilesX / 2) * 1.01,
      0.6,
      (cell.y - this.numTilesX / 2) * 1.01
    );
    this.entity.addChild(e);
    cellStateScript?.setCell(cell);
  }
}

export default BoardGenerate;
