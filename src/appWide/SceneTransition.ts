import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";

@createScript("sceneTransition")
class SceneTransition extends ScriptTypeBase {

  loaded = false

  initialize() {
    const sceneItem = this.app.scenes.find('ArcticJungle');
    if (!sceneItem) {
      throw new Error('missing arctic jungle')
    }

    // Load the scene hierarchy with a callback when it has finished
    this.app.scenes.loadSceneHierarchy(sceneItem, function (err, _loadedSceneRootEntity) {
        if (err) {
            console.error(err);
        } else {
            this.loaded = true
        }
    });

    // Load the scene settings with a callback when it has finished
    this.app.scenes.loadSceneSettings(sceneItem, function (err) {
        if (err) {
            console.error(err);
        } else {
            this.loaded = true
        }
    });
  }
}

export default SceneTransition
