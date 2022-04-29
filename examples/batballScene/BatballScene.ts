import GameElement from '../../src/engine/elements/GameElement'
import Bat from './Bat'
import Dolly from './Dolly'
import Floor from './Floor'
import Lights from './Lights'
import Player from './Player'
import ThrowDirection from './ThrowDirection'
import ThrowObjects from './ThrowObjects'
import WebXR from './WebXR'

export default class BatballScene extends GameElement {
  webxr = new WebXR()
  lights = new Lights()
  floor = new Floor()
  bat = new Bat()
  player = new Player()
  dolly = new Dolly(this.webxr, this.player, this.bat)
  throwDirection = new ThrowDirection(this.dolly)
  throwObjects = new ThrowObjects(this.dolly, this.player, this.throwDirection)

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
