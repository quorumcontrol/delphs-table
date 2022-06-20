import { generateFakeWarriors } from "../boardLogic/Warrior";
import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript, attrib } from "../utils/createScriptDecorator";
import Grid from "../boardLogic/Grid";
import Cell from "../boardLogic/Cell";
import { Entity, GraphNode } from "playcanvas";
import CellState from "./CellState";
import { GameConfig } from "../utils/config";

@createScript("boardGenerate")
class BoardGenerate extends ScriptTypeBase {
  currentPlayer = "";

  ground: GraphNode;
  grid?: Grid;

  timer = 0;

  started = false;

  initialize() {
    this.initialCellSetup = this.initialCellSetup.bind(this);
    this.onStart = this.onStart.bind(this);
    this.entity.on("start", this.onStart);
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPlayer = urlParams.get("player") || "";
    console.log('current player: ', this.currentPlayer)
  }

  setGrid(grid: Grid) {
    this.grid = grid;

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
    console.log("set grid: ", this.grid);
  }

  onStart() {
    if (!this.grid) {
      throw new Error("no grid");
    }

    this.grid.everyCell(this.initialCellSetup);
  }

  update(dt: number) {
    // this.timer += dt;
    // if (this.timer >= 6) {
    //   const tick = this.grid.doTick();
    //   console.log(tick);
    //   if (!this.entity.fire) {
    //     throw new Error('no fire method')
    //   }
    //   this.entity.fire("tick", tick);
    //   console.log('destination: ', this.getGameConfig().currentPlayer?.destination)
    //   this.timer = 0;
    // }
  }

  getGameConfig(): GameConfig {
    return {
      currentPlayer: this.grid?.warriors?.find((w) => w.id.toLowerCase() === this.currentPlayer.toLowerCase()),
      grid: this.grid,
      controller: this.entity,
    };
  }

  private initialCellSetup(cell: Cell) {
    if (!this.grid) {
      throw new Error("no grid");
    }
    try {
      const e = this.ground.clone();
      const cellStateScript = this.getScript<CellState>(e as Entity, "cellState");
      if (!cellStateScript) {
        throw new Error("no script");
      }
      console.log("initial cell");
      // Set the world position of the cloned tile. Note that because
      // our tiles are 10x10 in X,Z dimensions, we have to multiply
      // the position by 10
      e.setPosition(
        (cell.x - this.grid.sizeX / 2) * 1.01,
        0.6,
        (cell.y - this.grid.sizeY / 2) * 1.01
      );
      this.entity.addChild(e);
      cellStateScript?.setCell(cell);
    } catch (err) {
      console.error("error initial cell: ", err);
      throw err;
    }
  }
}

export default BoardGenerate;
