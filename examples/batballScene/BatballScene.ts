import GameElement from '../../src/engine/elements/GameElement'
import Bat from './Bat'
import Dolly from './Dolly'
import Floor from './Floor'
import Lights from './Lights'
import Player from './Player'
import ThrowDirection from './ThrowDirection'
import ThrowObjects from './ThrowObjects'

export default class BatballScene extends GameElement {
  lights: Lights
  floor: Floor
  bat: Bat
  player: Player
  dolly: Dolly
  throwDirection: ThrowDirection
  throwObjects: ThrowObjects

  onEnterScene() {
    this.lights = new Lights()
    this.floor = new Floor()
    this.bat = new Bat()
    this.player = new Player()
    this.dolly = new Dolly(this.player, this.bat)
    this.throwDirection = new ThrowDirection(this.dolly)
    this.throwObjects = new ThrowObjects(this.dolly, this.player, this.throwDirection)

    this.requestRender()
  }

  render() {
    return [
      this.lights,
      this.floor,
      this.player,
      this.dolly,
      this.throwDirection,
      this.throwObjects,
    ]
  }
}
