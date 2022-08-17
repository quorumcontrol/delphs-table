import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";

const TRACE_AT = 0.8 // number of seconds to start tracing

@createScript("testCellSelector")
class TestCellSelector extends ScriptTypeBase {

  timer = 0
  startedEvent?: { x: number, y: number }

  initialize() {
    console.log('initialize')
    if (!this.entity.camera) {
      console.error("This script must be applied to an entity with a camera component.");
      return;
    }

    console.log('adding handlers')
    // Add a mousedown event handler
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.mouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.clearEvent, this);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.clearEvent, this);

    // Add touch event only if touch is available
    if (this.app.touch) {
      this.app.touch.on(pc.EVENT_TOUCHSTART, this.touchStart, this);
      this.app.touch.on(pc.EVENT_TOUCHMOVE, this.clearEvent, this);
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

  clearEvent(e: pc.TouchEvent) {
    if (this.startedEvent) {
      const distance = this.getDistance(e.touches[0].x, e.touches[0].y)
      if (distance < 10) {
        console.log('no clear, tiny movement')
        return
      }
      alert('cleared with a distance of ' + (Math.ceil(distance * 100) / 100).toString())
      this.startedEvent = undefined
      e.event.preventDefault()
    }

  }

  getDistance = function (x:number, y:number) {
    // Return the distance between the two points
    var dx = this.startedEvent.x - x;
    var dy = this.startedEvent.y - y;    
    
    return Math.sqrt((dx * dx) + (dy * dy));
};

  mouseDown(e: pc.MouseEvent) {
    console.log('mouse down')
    this.startedEvent = { x: e.x, y: e.y }
  }

  touchStart(e: pc.TouchEvent) {
    console.log("touch start: ", e)
    // Only perform the raycast if there is one finger on the screen
    if (e.touches.length === 1) {
      console.log("would do startedEvent")
      this.startedEvent = { x: e.touches[0].x, y: e.touches[0].y }
    } else {
      alert('nope, touches length: ' + e.touches.length)
    }
    e.event.preventDefault();
  }

  doRaycast(screenX: number, screenY: number) {
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
      console.log("You selected ", hitEntity.name, hitEntity);
      alert('worked')
    } else {
      console.log('no result')
    } 
  }
}

export default TestCellSelector;
