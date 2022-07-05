import { Entity } from "playcanvas";
import { CellOutComeDescriptor } from "../boardLogic/Cell";
import { TickOutput } from "../boardLogic/Grid";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { getGameConfig } from "../utils/config";

import { createScript } from "../utils/createScriptDecorator";

import mustFindByName from "../utils/mustFindByName";

@createScript("hud")
class Hud extends ScriptTypeBase {
  uiText: Entity;
  eventTemplate: Entity;

  inProgress?:Promise<any>

  initialize() {
    this.uiText = mustFindByName(this.entity, "Status");
    this.eventTemplate = mustFindByName(this.entity, "Event");
    this.eventTemplate.enabled = false;
    getGameConfig(this.app.root).controller.on("tick", this.handleTick, this);
  }

  handleTick(tickOutput:TickOutput) {
    const config = getGameConfig(this.app.root);
    const grid = config.grid;
    const player = config.currentPlayer
    if (!grid) {
      return;
    }
    const text = [`Round ${grid.tick}/${grid.gameLength}\n`]
      .concat(
        grid.warriors?.map((w) => {
          const prefix = config.currentPlayer?.id === w.id ? "-> " : "";
          return `${prefix}${w.name} (A: ${w.attack}, D: ${w.defense}): ${Math.ceil(
            w.currentHealth
          )} HP / ${w.wootgumpBalance} WG`;
        })
      )
      .join("\n");
    this.uiText.element!.text = text;
      

    // lets see if anything happened to the player themselves
    const events = this.getInterestingEvents(tickOutput.outcomes, player?.id)
    console.log('interesting: ', events)
    events.forEach(this.playEvent.bind(this))

    if (config.grid?.isOver()) {
      const gameOver = this.entity.findByName("GameOver");
      if (gameOver) {
        gameOver.enabled = true;
      }
    }
  }
  
  private playEvent(eventText:string) {
    const playEvent = () => {
      return new Promise<void>((resolve,reject) => {
        try {
          console.log('playing event', eventText)
          const eventElement = this.eventTemplate.clone() as Entity
          eventElement.enabled = true
          this.entity.addChild(eventElement)
          eventElement.element!.text = eventText
          const curPosition = eventElement.getLocalPosition()
          console.log(eventElement)

          let total = 0
          const duration = 5.0

          eventElement.tween(curPosition).to({x: curPosition.x, y: curPosition.y + 200, z: curPosition.z}, duration, pc.SineIn).start().on('complete', () => {
            eventElement.destroy()
          }).on('update', (dt:any) => {
            total = total + dt
            if (total >= duration / 2) {
              resolve()
            }
          })
        } catch(err) {
          console.error('error playing event: ', err)
          reject(err)
        }
      })
    }
    if (this.inProgress) {
      this.inProgress = this.inProgress.then(playEvent.bind(this))
      return
    }
    this.inProgress = playEvent.bind(this)()
  }

  private getInterestingEvents(outcomes:CellOutComeDescriptor[][], player?:string):string[] {
    let interestingEvents:string[] = []
    outcomes.forEach((row) => {
      row.forEach((outcome) => {
        if (player && outcome.harvested[player]?.length > 0) {
          interestingEvents.push(`You harvested ${outcome.harvested[player].length} Wootgump`)
        }
        outcome.battleTicks.forEach((battleTick) => {
          if (battleTick.isOver) {
            return interestingEvents.push(`${battleTick.attacker.name} defeats ${battleTick.attacker.name}`)
          }
          if (battleTick.attackRoll > battleTick.defenseRoll) {
            return interestingEvents.push(`${battleTick.attacker.name} attacks ${battleTick.defender.name} for ${battleTick.attackRoll - battleTick.defenseRoll} damage.`)
          }
          interestingEvents.push(`${battleTick.defender.name} blocks ${battleTick.attacker.name}.`)
        })
      })
    })
    return interestingEvents

  }

}

export default Hud;
