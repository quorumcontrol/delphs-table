import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";
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

  next:(()=>any)[]

  initialize() {
    this.initialCellSetup = this.initialCellSetup.bind(this);
    this.onStart = this.onStart.bind(this);
    this.entity.on("start", this.onStart);
    const urlParams = new URLSearchParams(window.location.search);
    this.currentPlayer = urlParams.get("player") || "";
    console.log('current player: ', this.currentPlayer)
    this.next = []
  }

  update() {
    if (this.next.length > 0) {
      this.next.forEach((func) => {
        func()
      })
      this.next = []
    }
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
    this.focusOnPlayerCell()
  }

  focusOnPlayerCell() {
    const config = this.getGameConfig()
    const camera = this.app.root.findByName('Camera')
    if (!camera) {
      throw new Error('no camera')
    }
    const cameraScript = this.getScript<any>(camera as Entity, "orbitCamera");
    if (!cameraScript) {
      throw new Error('no camera script')
    }
    const location = config.currentPlayer?.location
    if (location) {
      console.log('focusing camera on player')
      
      const cellEntity = this.entity.findByName(this.cellNameFromCell(location))
      this.next.push(() => {
        console.log('calling focus on ', cellEntity)
        cameraScript.focus(cellEntity)
      })
      return
    }
    // if no current player or no location, then lets see the whole board
    this.next.push(() => {
      cameraScript.focus(this.entity)
    })
  }

  getGameConfig(): GameConfig {
    return {
      currentPlayer: this.grid?.warriors?.find((w) => w.id.toLowerCase() === this.currentPlayer.toLowerCase()),
      grid: this.grid,
      controller: this.entity,
    };
  }

  private cellNameFromCell(cell:Cell) {
    return `cell-${cell.x}-${cell.y}`
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
      // Set the world position of the cloned tile. Note that because
      // our tiles are 10x10 in X,Z dimensions, we have to multiply
      // the position by 10
      e.setPosition(
        (cell.x - this.grid.sizeX / 2) * 1.01,
        0.6,
        (cell.y - this.grid.sizeY / 2) * 1.01
      );
      e.name = this.cellNameFromCell(cell)
      this.entity.addChild(e);
      cellStateScript?.setCell(cell);
    } catch (err) {
      console.error("error initial cell: ", err);
      throw err;
    }
  }
}

export default BoardGenerate;
