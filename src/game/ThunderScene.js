import GameElement from '../engine/GameElement';
import Grave from './Grave';
import * as THREE from 'three'
import Tree from './Tree';
import Thunder from './Thunder';

export default class ThunderScene extends GameElement {

  grave = new Grave()

  trees = [
    [-1.2, 2.3], [-0.6, 1], [0.5, 1.6], [1.3, 2.1], [1.22, 1.1],
    [-1, -1], [0.2, -0.75], [1.1, -0.8], [0.5, -1.8], [-0.5, -1.9]
  ].map(p => new Tree(p))

  ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.3)

  moonLight = (() => {
    const ret = new THREE.DirectionalLight(0xb9d5ff, 0.3)
    ret.position.set(4, 5, - 2)
    ret.shadow.mapSize.width = 256
    ret.shadow.mapSize.height = 256
    ret.shadow.camera.near = 4
    ret.shadow.camera.far = 9
    return ret
  })()

  plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(3, 5),
      new THREE.MeshStandardMaterial({ color: 0x4e6a1b })
  ).rotateX(-Math.PI * 0.5)

  thunder = new Thunder()

  constructor() {
    super()
    this.setCastShadow(true)
    this.setReceiveShadow(true)
  }

  render() {
    return [
      this.ambientLight,
      this.moonLight,
      this.grave,
      this.plane,
      this.thunder,
      ...this.trees
    ]
  }
}