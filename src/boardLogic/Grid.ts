
import Cell from './Cell'
import { deterministicRandom, fakeRandomSeed } from './random'
import Warrior from './Warrior'
import debug from 'debug'

const log = debug('Grid')

interface GridOptions {
  warriors: Warrior[]
  seed:string
  sizeX?: number
  sizeY?: number
}

class Grid {
  id:string

  sizeX
  sizeY
  chanceOfSpawningWootGumpIn1000 = 10
  currentSeed:string

  warriors?: Warrior[]

  tick = 0
  // 2x2 array of locations
  grid:Cell[][] = []

  
  constructor(opts:GridOptions) {
    this.currentSeed = opts.seed
    this.id = `grid-${this.currentSeed}`
    this.sizeX = opts.sizeX || 20
    this.sizeY = opts.sizeY || 20
    this.initialCellPopulation(opts.warriors)
  }

  doTick() {
    log(`------ tick: ${this.tick} seed: ${this.currentSeed} ------`)
    // go through every cell and handle its updates
    this.everyCell((cell) => {
      cell.handleOutcomes(this.tick, this.currentSeed)
    })
    this.everyCell((cell) => {
      cell.doMovement(this.tick, this.currentSeed)
    })
    // then update which tick we are at
    this.newRandomSeed()
    this.tick++
    return { tick: this.tick, seed: this.currentSeed }
  }

  private newRandomSeed() {
    this.currentSeed = fakeRandomSeed()
    return this.currentSeed
  }

  everyCell(func:(cell:Cell)=>any) {
    for (let y = 0; y < this.sizeY; y++) {
      for (let x = 0; x < this.sizeX; x++) {
        func(this.grid[x][y])
      }
    }
  }

  private initialCellPopulation(warriors:Warrior[]) {
    for (let y = 0; y < this.sizeY; y++) {
      for (let x = 0; x < this.sizeX; x++) {
        this.grid[x] = this.grid[x] || []
        this.grid[x][y] = new Cell({x, y, grid: this})
      }
    }
    this.warriors = warriors
    warriors.forEach((warrior) => {
      this.grid[deterministicRandom(this.sizeX, `grid-${warrior.id}-x`, this.currentSeed)][deterministicRandom(this.sizeY, `grid-${warrior.id}-y`, this.currentSeed)].addWarrior(warrior)
    })
  }

}

export default Grid
