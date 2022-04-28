import * as THREE from 'three'
import GameElement from "../../src/engine/elements/GameElement"

export default class Thunder extends GameElement {

  thunder = new THREE.PointLight(0x4d88ff, 25, 20)
  state = {
    showThunder: true
  }

  constructor() {
    super()

    this.setCastShadow(true)
    
    this.thunder.shadow.mapSize.width = 1024 * 2
    this.thunder.shadow.mapSize.height = 1024 * 2
    this.thunder.shadow.camera.near = 3
    this.thunder.shadow.camera.far = 5
    this.thunder.position.y = 5
    this.thunder.visible = false
    document.getElementById('btn-thunder').addEventListener('click', () => {
      this.state.showThunder = !this.state.showThunder
    })
  }

  tick(elapsedTime: number) {
    // Thunder rotation
    this.thunder.position.x = Math.sin(elapsedTime * 5) * 5
    this.thunder.position.z = Math.cos(elapsedTime * 5) * 5
    if (Math.random() < 0.015) {
      this.thunder.visible = true
      this.thunder.intensity = Math.random() * (200 - 5) + 5
      setTimeout(() => {
          this.thunder.visible = false
      }, Math.random() * (30 - 10) + 10)
    }
  }

  render() {
    return this.state.showThunder && this.thunder
  }
}