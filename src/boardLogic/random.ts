import { randomInt, createHash } from 'crypto'
import { BigNumber } from 'ethers'

export function fakeRandomSeed() {
  return `local-seed-${randomInt(25000000)}`
}

export function deterministicRandom(max:number, id:string, seed:string) {
  const hash = createHash('sha256').update(`${id}-${seed}`).digest('hex');
  const num = BigNumber.from(`0x${hash}`)
  return num.mod(max).toNumber()
}
