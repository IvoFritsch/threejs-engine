import * as THREE from 'three'
import { MathUtils } from 'three'

import GameElement from './engine/GameElement'
export default class Floor extends GameElement {

  floor = new THREE.Mesh(
    new THREE.PlaneGeometry( 3, 3 ),
    new THREE.MeshStandardMaterial( { color: 'blue' } ) 
  ).rotateX(MathUtils.degToRad(45))

  constructor() {
    super()
  }

  render() {
    return this.floor
  }
}