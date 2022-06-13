import { Entity, GraphNode } from "playcanvas";
import Battle, { BattleTickReport } from "../boardLogic/Battle";
import Warrior from "../boardLogic/Warrior";
import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";
import mustFindByName from "../utils/mustFindByName";
import { randomBounded } from "../utils/randoms";
import PlayerMarker from "./PlayerMarker";

@createScript("battleUI")
class BattleUI extends ScriptTypeBase {
  xSize: number;
  zSize: number;

  battle?: Battle
  textTemplate: Entity; // for now
  playerMarkerTemplate: Entity

  initialize() {
    this.handleTick = this.handleTick.bind(this);
    if (!this.entity.render) {
      throw new Error("no render");
    }

    const tileBoundingBox = this.entity.render.meshInstances[0].aabb;
    this.xSize = tileBoundingBox.halfExtents.x * 0.8;
    this.zSize = tileBoundingBox.halfExtents.z * 0.8;

    this.textTemplate = mustFindByName(this.entity, "Text");
    this.textTemplate.enabled = false;
    const templates = mustFindByName(this.app.root, 'Templates')
    this.playerMarkerTemplate = mustFindByName(templates, 'PlayerMarker')
  }

  destroy() {
    if (this.battle) {
      this.battle.off('tick', this.handleTick)
    }
    this.entity.destroy()
  }

  handleTick(tick:BattleTickReport) {
    const damageString = tick.attackRoll > tick.defenseRoll ? `${tick.attackRoll - tick.defenseRoll} damage` : 'blocked'
    const text = `${tick.attacker.name} attacks ${tick.defender.name}. ${damageString}`
    const textElement = this.textTemplate.clone() as Entity
    textElement.enabled = true
    this.entity.addChild(textElement)
    textElement.element!.text = text    
    textElement.setLocalScale(0.05, 0.5, 0.05)
    const startingPosition = textElement.getLocalPosition()
    console.log('starting from: ', startingPosition)
    textElement.tween(startingPosition).to({x: startingPosition.x, y: startingPosition.y + 100, z: startingPosition.z}, 1.0, pc.SineIn).start().on('complete', () => {
      textElement.destroy()
    })
  }

  setBattle(battle: Battle) {
    this.battle = battle;
    this.battle.on('tick', this.handleTick)
    this.initialUISetup();
  }

  initialUISetup() {
    if (!this.battle) {
      throw new Error('no battle')
    }
    this.battle.warriors.forEach((warrior) => {
      this.placeWarrior(warrior)
    })
  }

  private placeWarrior(warrior: Warrior) {
    const playerMarker = this.playerMarkerTemplate.clone();
    playerMarker.name = `${this.battle?.battleId()}-marker-${warrior.id}`;

    this.entity.addChild(playerMarker);
    this.getScript<PlayerMarker>(playerMarker as Entity, 'playerMarker')?.setWarrior(warrior)

    playerMarker.setLocalScale(0.1, 10, 0.1);
    const rndX = randomBounded(this.xSize);
    const rndZ = randomBounded(this.zSize);

    playerMarker.setLocalPosition(rndX, 5, rndZ);
    playerMarker.setRotation(0, randomBounded(0.2), 0, 1);
    return playerMarker;
  }


}

export default BattleUI;
