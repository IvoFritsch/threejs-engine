import * as THREE from 'three'
import GameElement from '../../src/engine/elements/GameElement'

export default class Lights extends GameElement {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)

  constructor() {
    super()
    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    this.directionalLight.shadow.camera.far = 15
    this.directionalLight.shadow.camera.left = -10
    this.directionalLight.shadow.camera.top = 10
    this.directionalLight.shadow.camera.right = 10
    this.directionalLight.shadow.camera.bottom = -10
    this.directionalLight.position.set(5, 5, 5)
  }

  render() {
    return [this.ambientLight, this.directionalLight]
  }
}
