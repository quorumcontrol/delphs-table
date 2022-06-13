import { Entity } from "playcanvas";
import Warrior from "../boardLogic/Warrior";
import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";
import mustFindByName from "../utils/mustFindByName";

@createScript("playerMarker")
class PlayerMarker extends ScriptTypeBase {

  warrior?: Warrior
  name: Entity
  healthText: Entity
  gumpText: Entity

  initialize() {
    if (!this.entity.render) {
      throw new Error('no render')
    }
    this.name = mustFindByName(this.entity, "Name")
    this.healthText = mustFindByName(this.entity, "HealthText")
    this.gumpText = mustFindByName(this.entity, "GumpText")
  }

  update() {
    if (this.warrior) {
      this.healthText.element!.text = `${Math.ceil(this.warrior.currentHealth)}`
      this.gumpText.element!.text = `Gump: ${this.warrior.wootgumpBalance}`
    }
  }
  
  setWarrior(warrior:Warrior) {
    this.warrior = warrior
    this.name.element!.text = warrior.name
  }
}

export default PlayerMarker
