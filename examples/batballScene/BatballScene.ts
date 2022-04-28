import GameElement from '../../src/engine/elements/GameElement'
import Floor from './Floor'
import Lights from './Lights'
import Player from './Player'
import ThrowDirection from './ThrowDirection'
import ThrowObjects from './ThrowObjects'

export default class BatballScene extends GameElement {
  lights = new Lights()
  floor = new Floor()
  player = new Player()
  throwDirection = new ThrowDirection()
  throwObjects = new ThrowObjects(this.player, this.throwDirection)

  render() {
    return [this.lights, this.floor, this.player, this.throwDirection, this.throwObjects]
  }
}
