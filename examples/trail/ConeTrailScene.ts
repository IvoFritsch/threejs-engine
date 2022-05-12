import * as THREE from 'three'
import Lights from './Lights'
import Sphere from './Sphere'
import GameElement from '../../src/engine/elements/GameElement'

export default class ConeTrailScene extends GameElement {
  sphere = new Sphere()
  lights = new Lights()

  cone = new THREE.Mesh(
    new THREE.ConeBufferGeometry(0.28, 2),
    new THREE.MeshBasicMaterial({
      opacity: 0.3,
      transparent: true,
    })
  )

  constructor() {
    super()
    this.cone.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 1, 0))
    this.cone.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
  }

  tick() {
    const spherePosition = this.sphere.sphere.position

    this.cone.lookAt(spherePosition)
    this.cone.position.copy(spherePosition)
  }

  render() {
    return [this.cone, this.sphere, this.lights]
  }
}
