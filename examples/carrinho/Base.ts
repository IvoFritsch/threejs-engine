import GameElement from "../../src/engine/elements/GameElement";
import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MathUtils, MeshStandardMaterial, Object3D } from "three";
import Tree from "../thunderScene/Tree";
import KeyboardKey from "../../src/engine/controls/KeyboardKey";
import { WhileDown } from "../../src/engine/controls/WhileKey";
import DefaultGLTFElement from "../../src/engine/elements/DefaultGLTFElement";
import Veiculo from "./Veiculo";

export default class Base extends GameElement {

  chao = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({color: 0x554d46})
  ).rotateX(MathUtils.degToRad(-90))

  sunLight = new THREE.DirectionalLight(0xffffff, 0.6)
                .translateY(20)
                .translateX(20)
                .translateZ(20)
  ambientLight = new THREE.AmbientLight(0xffffff, 0.6)

  axesHelper = new THREE.AxesHelper( 5 );

  campfire = new DefaultGLTFElement('/campfire.glb', ({ helpers: { traverseMaterials } }) => {
    traverseMaterials((m: THREE.MeshStandardMaterial) => m.metalness = 0)
  })

  tree = new DefaultGLTFElement('/tree.glb', ({ model, helpers: { traverseMaterials } }) => {
    traverseMaterials((m: THREE.MeshStandardMaterial) => m.metalness = 0)
    model.scale.y = 0.75
    model.translateX(1.2).translateZ(-0.8)
  })

  veiculo = new Veiculo(3, 1)

  constructor() {
    super()
    this.setCastShadow(true)
    this.setReceiveShadow(true)
  }


  onEnterScene() {
    this.engine.getScene().fog = new THREE.Fog(0x000000, 0, 25)
    // const int = setInterval(() => { this.state.isShowing = !this.state.isShowing }, 100)
    // return () => clearInterval(int)
  }

  render() {
    return [
      this.ambientLight,
      [this.sunLight], //, new THREE.DirectionalLightHelper(this.sunLight)],
      this.campfire,
      this.tree,
      //this.axesHelper,
      this.veiculo,
      this.chao
    ]
  }
}