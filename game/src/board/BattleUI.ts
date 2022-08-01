import { Entity, GraphNode, SoundComponent } from "playcanvas";
import Battle, { BattleTickReport } from "../boardLogic/Battle";
import Warrior from "../boardLogic/Warrior";
import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";
import mustFindByName from "../utils/mustFindByName";
import { randomBounded } from "../utils/randoms";
import PlayerMarker from "./PlayerMarker";

const standardPlaces:[number,number,number][] = [[0.3,43,0.5],[-0.1,43.5,-0.4]]

@createScript("battleUI")
class BattleUI extends ScriptTypeBase {
  xSize: number;
  zSize: number;

  battle?: Battle
  textTemplate: Entity; // for now
  playerMarkerTemplate: Entity
  soundComponent: SoundComponent

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
    const soundComponent = mustFindByName(this.entity, "Sound").findComponent('sound') as SoundComponent
    if (!soundComponent) {
      throw new Error('missing sound component for battle')
    }
    this.soundComponent = soundComponent
    Object.values(this.soundComponent.slots).forEach((slot) => {
      slot.play()
    });
    Object.values((mustFindByName(this.entity, 'Announcer').findComponent('sound') as SoundComponent).slots)[0].play()
  }

  destroy() {
    if (this.battle) {
      this.battle.off('tick', this.handleTick)
    }
    Object.values(this.soundComponent.slots).forEach((slot) => {
      slot.stop()
    })
    this.entity.destroy()
  }

  handleTick(tick:BattleTickReport) {
    const damageString = tick.attackRoll > tick.defenseRoll ? `${tick.attackRoll - tick.defenseRoll} damage` : 'blocked'
    const text = `${tick.attacker.name} attacks ${tick.defender.name}. ${damageString}`
    const textElement = this.textTemplate.clone() as Entity
    textElement.enabled = true
    this.entity.addChild(textElement)
    textElement.element!.text = text    
    textElement.setLocalScale(0.04, 4, 0.04)
    textElement.setLocalPosition(0,50,0)
    const startingPosition = textElement.getLocalPosition()
    console.log('starting from: ', startingPosition)
    textElement.tween(startingPosition).to({x: startingPosition.x, y: startingPosition.y + 200, z: startingPosition.z}, 5.0, pc.SineIn).start().on('complete', () => {
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
    this.battle.warriors.forEach((warrior, i) => {
      this.placeWarrior(warrior, i)
    })
  }

  private placeWarrior(warrior: Warrior, index:number) {
    const playerMarker:Entity = this.playerMarkerTemplate.clone() as Entity;
    playerMarker.name = `${this.battle?.battleId()}-marker-${warrior.id}`;

    this.entity.addChild(playerMarker);
    const playerMarkerScript = this.getScript<PlayerMarker>(playerMarker, 'playerMarker')
    if (!playerMarkerScript) {
      throw new Error('missing script')
    }
    playerMarkerScript.setWarrior(warrior)
    setTimeout(() => {
      playerMarkerScript.setBattling(true, index === 1)
    }, randomBounded(1000)) // don't set it immediately here, so that the animations don't sync up

    playerMarker.setLocalScale(0.1, 10, 0.1);
    playerMarker.setLocalPosition(...standardPlaces[index]);

    return playerMarker;
  }
}

export default BattleUI;
