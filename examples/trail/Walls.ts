import * as THREE from 'three'
import { BoxBufferGeometry } from 'three'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import GameElement from '../../src/engine/elements/GameElement'

export default class Walls extends GameElement {
  wall = new DefaultPhysicsElement(
    new THREE.Mesh(new BoxBufferGeometry(8, 5, 0.2), new THREE.MeshToonMaterial())
  )

  smallWallRight = new DefaultPhysicsElement(
    new THREE.Mesh(new BoxBufferGeometry(5, 1, 0.2), new THREE.MeshToonMaterial())
  )

  smallWallLeft = new DefaultPhysicsElement(
    new THREE.Mesh(new BoxBufferGeometry(5, 1, 0.2), new THREE.MeshToonMaterial())
  )

  constructor() {
    super()
    this.positionWall()
    this.positionSmallWallRight()
    this.positionSmallWallLeft()
  }

  positionSmallWallRight() {
    const body = this.smallWallRight.getBody()
    body.position.set(7.4, 0.5, 5)
    body.quaternion.setFromEuler(0, (90 * Math.PI) / 180, 0)
  }

  positionSmallWallLeft() {
    const body = this.smallWallLeft.getBody()
    body.position.set(5, 0.5, 7.4)
  }

  positionWall() {
    const body = this.wall.getBody()
    body.position.set(-4, 2.5, -4)
    body.quaternion.setFromEuler(0, (45 * Math.PI) / 180, 0)
  }

  render() {
    return [this.wall, this.smallWallRight, this.smallWallLeft]
  }
}
