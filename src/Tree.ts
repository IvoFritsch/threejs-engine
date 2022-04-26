import * as THREE from 'three'
import Tick from './engine/decorators/Tick'
import GameElement from './engine/GameElement'
import GlobalEngineContext from './engine/GlobalEngineContext'

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

  group = new THREE.Group()

  rotandoZ = false

  constructor() {
    super()
    this.group.add(this.leaves, this.trunk)
    // GlobalEngineContext.engine.info.target é o canvas onde o jogo está sendo renderizado
    GlobalEngineContext.engine.info.target.addEventListener('click', () => this.click())
    setTimeout(() => this.click(), 3000);
  }

  click() {
    this.rotandoZ = !this.rotandoZ
  }

  @Tick()
  tick() {
    this.group.rotateX(0.01)
    if(this.rotandoZ) {
      this.group.rotateZ(0.01)
    }
  }

  render() {
    return [
      this.group,
      this.light,
      this.lantern
    ]
  }

}