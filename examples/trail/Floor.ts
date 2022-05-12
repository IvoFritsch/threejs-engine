import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import GameElement from '../../src/engine/elements/GameElement'

export default class Floor extends GameElement {
  floor = new DefaultPhysicsElement(
    new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      new THREE.MeshToonMaterial({ color: 0x777777 })
    ),
    {
      shape: new CANNON.Plane(),
    }
  )

  constructor() {
    super()
    this.floor.rotation.x = -Math.PI * 0.5
  }

  render() {
    return this.floor
  }
}
