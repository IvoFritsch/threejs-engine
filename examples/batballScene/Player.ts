import * as THREE from 'three'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import GameElement from '../../src/engine/elements/GameElement'

export default class Player extends GameElement {
  private playerMesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.45, 1.6, 0.2),
    new THREE.MeshToonMaterial({ color: 0x00ff00 })
  ).translateY(0.8)
  private player = new DefaultPhysicsElement(this.playerMesh, undefined, {
    wireframe: true,
    renderMesh: false,
    updatePosition: false,
    updateRotation: false,
  })

  private onPlayerCollisionListeners: Function[] = []

  constructor() {
    super()
    this.playerMesh.visible = true

    this.player.body.addEventListener('collide', ({ body }: any) =>
      this.onPlayerCollisionListeners.forEach(listener => listener(body))
    )
  }

  onPlayerCollision(listener: Function) {
    this.onPlayerCollisionListeners.push(listener)
  }

  getPlayer() {
    return this.player
  }

  render() {
    return this.player
  }
}
