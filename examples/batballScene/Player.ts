import * as THREE from 'three'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import GameElement from '../../src/engine/elements/GameElement'
import gsap from 'gsap'

export default class Player extends GameElement {
  playerMesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.45, 1.6, 0.2),
    new THREE.MeshToonMaterial({ color: 0x00ff00 })
  )

  player = new DefaultPhysicsElement(this.playerMesh, { wireframe: true })

  constructor() {
    super()
    this.playerMesh.visible = false
    this.playerMesh.castShadow = true
    this.player.position.y = this.playerMesh.geometry.parameters.height / 2
    this.player.body.addEventListener('collide', ({ body }: any) =>
      this.onPlayerCollision(body)
    )
  }

  onPlayerCollision(body: any) {
    const { x, z } = body.velocity
    const force = 0.15
    gsap.to(this.player.body.position, { x: `+=${x * force}`, z: `+=${z * force}` })

    // Change color of object that hit player
    // for (const object of objectsToUpdate) {
    //     if (body.shapes[0].body === object.body) {
    //         object.mesh.material = new THREE.MeshToonMaterial({ color: 0xf1ba79 })
    //         break
    //     }
    // }
  }

  render() {
    return this.player
  }
}
