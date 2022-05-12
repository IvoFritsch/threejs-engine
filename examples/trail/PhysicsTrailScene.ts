import * as CANNON from 'cannon-es'
import GameElement from '../../src/engine/elements/GameElement'
import Floor from './Floor'
import Lights from './Lights'
import ThrowConeTrailSpheres from './ThrowConeTrailSpheres'
import ThrowParticleTrailSpheres from './ThrowParticleTrailSpheres'
import Walls from './Walls'

export default class PhysicsTrailScene extends GameElement {
  lights = new Lights()
  floor = new Floor()
  walls = new Walls()
  throwParticleTrailSpheres = new ThrowParticleTrailSpheres()
  throwConeTrailSpheres = new ThrowConeTrailSpheres()

  onEnterScene() {
    const world = this.engine.getPhysicsWorld()

    const defaultMaterial = new CANNON.Material('default')
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.6,
      }
    )

    world.defaultContactMaterial = defaultContactMaterial
  }

  render() {
    return [
      this.lights,
      this.floor,
      this.walls,
      this.throwParticleTrailSpheres,
      this.throwConeTrailSpheres,
    ]
  }
}
