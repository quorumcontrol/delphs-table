import { Entity } from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript, attrib } from "../utils/createScriptDecorator";

@createScript("faceCamera")
class FaceCamera extends ScriptTypeBase {
  @attrib({ type: "entity", default: null })
  camera:Entity

  update() {
    this.entity.lookAt(this.camera.getLocalPosition())
  }
}

export default FaceCamera
