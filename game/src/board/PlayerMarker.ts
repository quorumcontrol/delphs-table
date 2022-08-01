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
  threeDNameEntity:Entity
  threeDNameScript: any // textMesh script
  stats: Entity

  initialize() {
    this.name = mustFindByName(this.entity, "Name")
    this.healthText = mustFindByName(this.entity, "HealthText")
    this.gumpText = mustFindByName(this.entity, "GumpText")
    this.threeDNameEntity = mustFindByName(this.entity, "3DName")
    this.threeDNameScript = this.getScript(this.threeDNameEntity, "textMesh")!
    this.stats = mustFindByName(this.entity, "Stats")
  }

  update() {
    if (this.warrior) {
      this.threeDNameScript.text = `${this.warrior.name} (WG: ${this.warrior.wootgumpBalance})`
      // this.healthText.element!.text = `${Math.ceil(this.warrior.currentHealth)}`
      // this.gumpText.element!.text = `Gump: ${this.warrior.wootgumpBalance}`
      this.stats.element!.text = `HP:${Math.ceil(this.warrior.currentHealth)}/${this.warrior.initialHealth} A:${this.warrior.attack}  D:${this.warrior.defense}`
    }
  }

  setBattling(isBattling: boolean, rotate = false) {
    try {
      const model = mustFindByName(this.entity, 'HumanoidModel')
      model.anim?.setBoolean('isBattling', isBattling)

      if (rotate) {
        this.entity.setLocalEulerAngles(0, 180, 0);
        this.threeDNameEntity.setLocalEulerAngles(-20, 0, 0)
      }
    } catch (err) {
      // sometimes during replay this item is destroyed before there is a chance foor the isBattling
      // to be set by the battleUI. This just ignores that error
      console.log('error setBattling: ', err)
    }
  }

  setWarrior(warrior: Warrior) {
    this.warrior = warrior
    // this.name.element!.text = warrior.name
    this.threeDNameScript.text = `${warrior.name}`
    const config = getGameConfig(this.app.root)
    if (config.currentPlayer === warrior) {
      mustFindByName(this.entity, 'PlayerArrow').enabled = true
    }
  }
}

export default PlayerMarker
