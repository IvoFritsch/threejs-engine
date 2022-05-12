import * as THREE from 'three'
import GameElement from '../../src/engine/elements/GameElement'

export default class Lights extends GameElement {
  ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.3)
  directionalLight = new THREE.DirectionalLight(0xb9d5ff, 1)

  constructor() {
    super()
    this.directionalLight.position.set(2, 2, 0)
  }

  onEnterScene() {
    const camera = this.engine.getCamera()
    camera.position.set(0, 1, 10)
  }

  render() {
    return [this.ambientLight, this.directionalLight]
  }
}
