import * as CANNON from 'cannon-es'

export interface PhysicsWorldOptions {
  gravity: [number, number, number]
}

export default class PhysicsWorld extends CANNON.World{

  constructor(options: PhysicsWorldOptions) {
    super()
    this.gravity.set.apply(this.gravity, options.gravity)
    this.allowSleep = true
  }

  tick(elapsedTime: number, deltaElapsedTime: number) {
    this.step(1 / 60, deltaElapsedTime, 3)
  }
}
