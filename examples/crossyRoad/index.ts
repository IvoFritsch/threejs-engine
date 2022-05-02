import * as THREE from 'three'
import { MathUtils } from 'three';
import DefaultGLTFElement from '../../src/engine/elements/DefaultGLTFElement';
import GameElement from "../../src/engine/elements/GameElement";

export default class CrossyRoad extends GameElement {

  ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  sunLight = new THREE.DirectionalLight(0xffffff, 0.6)
            .translateY(20)
            .translateX(20)
            .translateZ(20)
  
  cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: 'blue'}))
  plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100), 
    new THREE.MeshStandardMaterial({ color: 'lightgreen' })
  ).rotateX(MathUtils.degToRad(-90))

  tiles = [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map((n) => 
    new DefaultGLTFElement('/crossyRoad/roadTile_160.gltf', ({model}) => model.translateX(n * 3))
  )

  currentTile = 159
  state = {
    tile: null as DefaultGLTFElement
  }

  constructor() {
    super()
    this.setCastShadow(true)
    this.setReceiveShadow(true);
    (window as any).nextTile = () => {
      this.currentTile++
      const name = `/crossyRoad/roadTile_${('000' + this.currentTile).substr(-3)}.gltf`
      console.log(name)
      this.state.tile = new DefaultGLTFElement(name)
    }
  }

  onEnterScene() {
    this.engine.getRenderer().setClearColor(0xcccccc)
  }

  render() {
    return [
      this.ambientLight,
      this.sunLight,
      this.cube,
      this.plane,
      this.state.tile,
      this.tiles
    ]
  }
}

/*
  /crossyRoad/roadTile_019.gltf - arvore 1
  /crossyRoad/roadTile_020.gltf - arvore 2
  /crossyRoad/roadTile_025.gltf - faixa segurança 1
  /crossyRoad/roadTile_075.gltf - faixa segurança 2
  /crossyRoad/roadTile_027.gltf - rua larga
  /crossyRoad/roadTile_031.gltf - rua normal 1
  /crossyRoad/roadTile_034.gltf - asfalto largo

  160 - rua com grama

  85 - 90 thilhos ??
  98 - thilhos
  99 - trilhos pós asfalto 
  104 - trilhos no asfalto 


*/