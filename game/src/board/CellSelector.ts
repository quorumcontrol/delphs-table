import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { getGameConfig } from "../utils/config";

import { createScript } from "../utils/createScriptDecorator";
import CellState from "./CellState";

const TRACE_AT = 0.8 // number of seconds to start tracing

@createScript("cellSelector")
class CellSelector extends ScriptTypeBase {

  timer = 0
  startedEvent?: { x: number, y: number }

  initialize() {
    if (!this.entity.camera) {
      console.error("This script must be applied to an entity with a camera component.");
      return;
    }

    this.handleExternalEvent = this.handleExternalEvent.bind(this)

    // Add a mousedown event handler
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.mouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.clearEvent, this);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.clearEvent, this);

    // Add touch event only if touch is available
    if (this.app.touch) {
      this.app.touch.on(pc.EVENT_TOUCHSTART, this.touchStart, this);
      this.app.touch.on(pc.EVENT_TOUCHMOVE, this.clearEvent, this);
    }

    window.addEventListener('message', this.handleExternalEvent)
  }

  handleExternalEvent(evt: any) {
    console.log('external message: ', evt)
    const config = getGameConfig(this.app.root)
    if (config.grid?.isOver()) {
      return
    }
    const msg = JSON.parse(evt.data)
    switch (msg.type) {
      case "destinationStarting":
        config.currentPlayer?.setPendingDestination(msg.x, msg.y)
        break;
      case "destinationComplete":
        config.currentPlayer?.clearPendingDestination()
        config.currentPlayer?.setDestination(msg.x, msg.y)
        break;
      default:
        console.error('unknown message type: ', msg)
    }
  }

  update(dt: number) {
    if (this.startedEvent) {
      this.timer += dt
      if (this.timer > TRACE_AT) {
        this.doRaycast(this.startedEvent.x, this.startedEvent.y)
        this.startedEvent = undefined
        this.timer = 0
      }
    }
  }

  clearEvent(e: pc.MouseEvent) {
    this.startedEvent = undefined
    e.event.preventDefault()
  }

  mouseDown(e: pc.MouseEvent) {
    this.startedEvent = { x: e.x, y: e.y }
  }

  touchStart(e: pc.TouchEvent) {
    // Only perform the raycast if there is one finger on the screen
    if (e.touches.length === 1) {
      this.startedEvent = { x: e.touches[0].x, y: e.touches[0].y }
    }
    e.event.preventDefault();
  }

  doRaycast(screenX: number, screenY: number) {
    const config = getGameConfig(this.app.root)
    if (config.grid?.isOver()) {
      return
    }
    // The pc.Vec3 to raycast from (the position of the camera)
    const from = this.entity.getPosition();

    // The pc.Vec3 to raycast to (the click position projected onto the camera's far clip plane)
    const to = this.entity.camera!.screenToWorld(
      screenX,
      screenY,
      this.entity.camera!.farClip
    );

    // Raycast between the two points and return the closest hit result
    const result = this.app.systems.rigidbody!.raycastFirst(from, to);
    console.log('raycast', from, to, this.entity.camera!.farClip, result)

    // If there was a hit, store the entity
    if (result) {
      const hitEntity = result.entity;
      console.log("You selected " + hitEntity.name);
      const currentPlayer = getGameConfig(this.app.root).currentPlayer
      console.log('current player: ', currentPlayer)
      if (!currentPlayer) {
        console.log('no current player')
        return
      }
      const cellState = this.getScript<CellState>(hitEntity, 'cellState')
      if (!cellState) {
        console.error('no cell state')
        return
      }
      if (!cellState.cell) {
        throw new Error('no cell')
      }
      console.log('posting message from game')
      parent.postMessage(JSON.stringify({
        type: 'destinationSetter',
        data: [cellState.cell.x, cellState.cell.y],
      }), '*')
      currentPlayer.setPendingDestination(cellState.cell.x, cellState.cell.y)
    }
  }
}

export default CellSelector;
