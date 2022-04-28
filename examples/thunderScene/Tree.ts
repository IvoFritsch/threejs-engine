import * as THREE from 'three'
import GameElement from '../../src/engine/elements/GameElement'

export default class Tree extends GameElement {

  trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.15, 0.43, 8)
      .translate(0, 0.43 / 2, 0), 
    new THREE.MeshStandardMaterial({ color: 0xae6b47 })
  )
  leaves = new THREE.Mesh(
    new THREE.CapsuleBufferGeometry(0.5, 0.5, 2, 5)
      .translate(0, 0.5 / 2, 0),
    new THREE.MeshStandardMaterial({ color: 0x607141 })
  ).translateY(0.9)

  group = new THREE.Group().add(this.trunk, this.leaves)

  constructor([positionX, positionY]: number[]) {
    super()
    this.setCastShadow(true)
    this.setReceiveShadow(true)

    this.trunk.castShadow = true
    this.leaves.castShadow = true
    this.group.position.x = positionX
    this.group.position.z = positionY
    const scale = Math.random() * (0.8 - 0.55) + 0.55;
    this.group.scale.set(scale, scale, scale)
  }

  render() {
    return this.group
  }

}