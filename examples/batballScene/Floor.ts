import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import GameElement from '../../src/engine/elements/GameElement'

export default class Floor extends GameElement {
  floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshToonMaterial({ color: 0x777777 })
  )
  subfloor = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150),
    new THREE.MeshToonMaterial({ color: 0x111111 })
  )

  floor = new DefaultPhysicsElement(this.floorMesh, {
    shape: new CANNON.Plane(),
  })

  constructor() {
    super()
    this.floorMesh.receiveShadow = true
    this.floor.rotation.x = -Math.PI * 0.5

    this.subfloor.receiveShadow = true
    this.subfloor.rotation.x = -Math.PI * 0.5
    this.subfloor.position.y = -0.01
  }

  render() {
    return [this.floor, this.subfloor]
  }
}
