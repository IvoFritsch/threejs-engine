import * as THREE from 'three'
import GameElement from '../../src/engine/elements/GameElement'

export default class Sphere extends GameElement {
  axesHelper = new THREE.AxesHelper(5)
  sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.3),
    new THREE.MeshStandardMaterial()
  )

  constructor() {
    super()
    this.sphere.position.set(0, 2, 2)
  }

  tick(elapsedTime: number) {
    this.sphere.position.setX(Math.cos(elapsedTime * 0.5) * 6)
    this.sphere.position.setY(Math.cos(elapsedTime * 2) * 2)
    this.sphere.position.setZ(Math.cos(elapsedTime * 2) * 3)
  }

  render() {
    return [this.sphere, this.axesHelper]
  }
}
