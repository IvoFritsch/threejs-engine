import * as CANNON from 'cannon-es'

export default class Physics {
  private world: CANNON.World

  constructor() {
    this.world = new CANNON.World()
    this.world.gravity.set(0, -1, 0)
    this.world.allowSleep = true
  }

  getWorld() {
    return this.world
  }

  tick(_elapsedTime: number, deltaElapsedTime: number) {
    this.world.step(1 / 60, deltaElapsedTime, 3)
  }
}
