import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";

import { randomBounded } from "../utils/randoms";

@createScript("randomTrees")
class RandomTrees extends ScriptTypeBase {
  initialize() {
    if (!this.entity.render) {
      throw new Error('no render')
    }
    if (!this.entity.name.includes('cell')) {
      return
    }
    const tileBoundingBox = this.entity.render.meshInstances[0].aabb;
    const xSize = tileBoundingBox.halfExtents.x;
    const zSize = tileBoundingBox.halfExtents.z;

    const templates = this.app.root.findByName("Templates");
    if (!templates) {
      throw new Error("no templates");
    }
    if (Math.random() > 0.5) {
      const tree = templates.findByName("SingleTree");
      if (!tree) {
        throw new Error("no tree");
      }
      const e = tree.clone();
      this.entity.addChild(e);
      e.setLocalScale(0.5, 0.5, 50);
  
      e.setLocalPosition(randomBounded(xSize), 0, randomBounded(zSize));
    }

  }
}

export default RandomTrees
