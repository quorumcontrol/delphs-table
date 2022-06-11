import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript, attrib } from "../utils/createScriptDecorator";

@createScript("boardGenerate")
class BoardGenerate extends ScriptTypeBase {
  @attrib({ type: "number", default: 10 })
  numTilesX = 10;

  @attrib({ type: "number", default: 10 })
  numTilesY = 10;

  initialize() {
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

    for (let y = 0; y < this.numTilesY; y++) {
      for (let x = 0; x < this.numTilesX; x++) {
        // Clone the tile
        const e = ground.clone();

        // Set the world position of the cloned tile. Note that because
        // our tiles are 10x10 in X,Z dimensions, we have to multiply
        // the position by 10
        e.setPosition(
          (x - this.numTilesX / 2) * 1.01,
          0.6,
          (y - this.numTilesX / 2) * 1.01
        );
        // Add the tile to the scene's hierarchy
        this.app.root.addChild(e);
      }
    }
  }
}

export default BoardGenerate;
