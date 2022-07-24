import { Entity } from "playcanvas";
import Warrior from "../boardLogic/Warrior";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { getGameConfig } from "../utils/config";

import { createScript } from "../utils/createScriptDecorator";
import mustFindByName from "../utils/mustFindByName";

@createScript("playerMarker")
class PlayerMarker extends ScriptTypeBase {

  warrior?: Warrior
  name: Entity
  healthText: Entity
  gumpText: Entity
  threeDName: any // textMesh script

  initialize() {
    this.name = mustFindByName(this.entity, "Name")
    this.healthText = mustFindByName(this.entity, "HealthText")
    this.gumpText = mustFindByName(this.entity, "GumpText")
    this.threeDName = this.getScript(mustFindByName(this.entity, "3DName"), "textMesh")!
  }

  update() {
    if (this.warrior) {
      this.healthText.element!.text = `${Math.ceil(this.warrior.currentHealth)}`
      this.gumpText.element!.text = `Gump: ${this.warrior.wootgumpBalance}`
      // if (this.warrior.currentHealth <= 0) {
      //   console.log('dead')
      // }
    }
  }
  
  setWarrior(warrior:Warrior) {
    this.warrior = warrior
    this.name.element!.text = warrior.name
    this.threeDName.text = warrior.name
    const config = getGameConfig(this.app.root)
    if (config.currentPlayer === warrior) {
      mustFindByName(this.entity, 'PlayerArrow').enabled = true
    }
  }
}

export default PlayerMarker
