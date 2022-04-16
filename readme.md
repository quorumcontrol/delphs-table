# Playcanvas typescript example

Project - https://playcanvas.com/project/913369/overview/typescript-example

Build - https://playcanv.as/p/DysznB0H

## Setup

- Install dependencies `npm i`
- Copy `.pcconfig` to your home directory e.g.
  - windows - `C:/Users/<username>`
  - macos - `/Users/<username>`
- Copy `pcconfig.example.json` and rename to `pcconfig.json`. This file is needed to configure playcanvas-sync to upload the file to correct PlayCanvas Editor project.
- In `pcconfig.json` fill `PLAYCANVAS_API_KEY`, `PLAYCANVAS_BRANCH_ID`, `PLAYCANVAS_PROJECT_ID` using https://github.com/playcanvas/playcanvas-sync#config-variables
- now you ready to go start `npm run dev`

## npm scripts

| Command         | Description                                           |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Compiles tsc files and push to playcanvas.com project |
| `npm run build` | Performs `build` and `push` to playcanvas.com project |

## Conventions

Scripts preferable structure

```ts
// typings and libs goes first, split by empty line
import { ScriptTypeBase } from "../../types/ScriptTypeBase";

// components second
import { falledCheckEvents } from "./falledCheck";

// utils third
import { createScript, attrib } from "../../utils/createScriptDecorator";
import { ebEvents, events } from "../../utils/events";

// consts here
const defaultAmmoCount = 30;

@createScript("shooting")
class Shooting extends ScriptTypeBase {
  // attributes
  @attrib({ type: "boolean", default: true })
  autoReload: boolean;
  @attrib({
    type: "number",
    default: 1,
    min: 0.01,
    description: "Reload time in seconds",
  })
  reloadTime: number;

  // local properties
  shotTimer: TInterval;
  reloadingTimer: TTimeout;
  isReloading: boolean = false;

  // methods
  initialize() {}

  onDestroy() {}
}

// default export at the end
export default Shooting;
```

## Improvements

- typescript classes cant inherit methods types from parent and also methods cant be arrow functions because they lost "this" may be somehow methods can be binded in createScriptDecorator but i didnt found how
- "debug subsystem" like ue4, map with flags that turn on/off debugCategories, should be invoked from dev tools console like `debugSubsystem("%system_name%", true)`
- eslint