import * as THREE from 'three'
import GameElement from './engine/GameElement'
import GlobalEngineContext from './engine/GlobalEngineContext'
import Floor from './Floor'

export default class Tree extends GameElement {

  leaves = new THREE.Mesh(
    new THREE.BoxGeometry( 1, 1, 1 ),
    new THREE.MeshStandardMaterial( { color: 'green' } ) 
  )

  trunk = new THREE.Mesh(
    new THREE.BoxGeometry( 0.5, 0.5, 1.4 ),
    new THREE.MeshStandardMaterial( { color: 'brown' } ) 
  )
  
  light = new THREE.AmbientLight()
  lantern = new THREE.DirectionalLight()

  floor = new Floor()

  group = new THREE.Group()

  rotandoZ = false

  constructor() {
    super()
    this.group.add(this.leaves, this.trunk)
    // GlobalEngineContext.engine.info.target é o canvas onde o jogo está sendo renderizado
    GlobalEngineContext.engine.info.target.addEventListener('click', () => this.click())
  }

  click() {
    this.state.rotandoZ = !this.state.rotandoZ
  }

  tick() {
    this.group.rotateX(0.01)
    if(this.state.rotandoZ) {
      this.group.rotateZ(0.01)
    }
  }

  render() {
    return [
      this.group,
      this.light,
      this.lantern,
      this.state.rotandoZ && this.floor // Floor é um subcomponente
    ]
  }

}