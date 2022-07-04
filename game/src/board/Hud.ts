import { Entity } from "playcanvas";
import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { getGameConfig } from "../utils/config";

import { createScript } from "../utils/createScriptDecorator";

import mustFindByName from "../utils/mustFindByName";

@createScript("hud")
class Hud extends ScriptTypeBase {
  uiText: Entity;

  initialize() {
    this.uiText = mustFindByName(this.entity, "Status");
    getGameConfig(this.app.root).controller.on("tick", this.handleTick, this);
  }

  handleTick() {
    const config = getGameConfig(this.app.root);
    const grid = config.grid;
    if (!grid) {
      return;
    }
    const text = [`Round ${grid.tick}/${grid.gameLength}\n`].concat(grid.warriors
      ?.map((w) => {
        const prefix = config.currentPlayer?.id === w.id ? "-> " : "";
        return `${prefix}${w.name} (A: ${w.attack}, D: ${w.defense}): ${Math.ceil(
          w.currentHealth
        )} HP / ${w.wootgumpBalance} WG`;
      }))
      .join("\n");
    this.uiText.element!.text = text || "";
    if (config.grid?.isOver()) {
      const gameOver = this.entity.findByName("GameOver")
      if (gameOver) {
        gameOver.enabled = true
      }
    }
  }
}

export default Hud;
