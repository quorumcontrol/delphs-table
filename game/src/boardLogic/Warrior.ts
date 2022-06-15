import Grid from "./Grid";
import { deterministicRandom } from "./random";

interface WarriorStats {
  id: string;
  name: string;
  attack: number;
  defense: number;
  initialHealth: number;
}

export function generateFakeWarriors(count: number, seed: string) {
  const warriors = [];
  for (let i = 0; i < count; i++) {
    warriors[i] = new Warrior({
      id: `warrior-${i}-${seed}`,
      name: `Warius ${i}`,
      attack: deterministicRandom(1000, `generateFakeWarriors-${i}-attack`, seed),
      defense: deterministicRandom(800, `generateFakeWarriors-${i}-defense`, seed),
      initialHealth: deterministicRandom(2000, `generateFakeWarriors-${i}-health`, seed),
    });
  }
  return warriors;
}

class Warrior implements WarriorStats {
  id: string;
  name: string = "DefaultName";
  attack: number = 200;
  defense: number = 100;
  initialHealth: number = 500;
  currentHealth: number = 500;

  destination?: [number, number];

  wootgumpBalance;

  constructor(opts: WarriorStats) {
    this.id = opts.id;
    this.name = opts.name;
    this.attack = opts.attack;
    this.defense = opts.defense;
    this.initialHealth = opts.initialHealth;
    this.currentHealth = this.initialHealth;
    this.wootgumpBalance = 0;
  }

  isAlive() {
    return this.currentHealth > 0;
  }

  // amount to add to halth as a decimal percentage (ie 0.10 is 10%) of initialHealth
  recover(percentage: number) {
    if (this.currentHealth >= this.initialHealth) {
      return 0;
    }
    const amountToUp = Math.min(
      this.initialHealth * percentage,
      this.initialHealth - this.currentHealth
    );
    this.currentHealth += amountToUp;
    return amountToUp;
  }

  setRandomDestination(grid: Grid) {
    const x = deterministicRandom(
      grid.sizeX,
      `${this.id}-destX-${grid.tick}`,
      grid.currentSeed
    );
    const y = deterministicRandom(
      grid.sizeY,
      `${this.id}-destY-${grid.tick}`,
      grid.currentSeed
    );
    this.destination = [x, y];
  }
}

export default Warrior;