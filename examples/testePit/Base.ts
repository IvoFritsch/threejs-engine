import GameElement from "../../src/engine/elements/GameElement";
import * as THREE from 'three'
import Quarto from "./Quarto";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MathUtils, Object3D } from "three";
import Tree from "../thunderScene/Tree";
import KeyboardKey from "../../src/engine/controls/KeyboardKey";
import { WhileDown } from "../../src/engine/controls/WhileKey";

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

  state = {
    campfire: null as Object3D,
    tree: null as Object3D,
  }

  @WhileDown('Enter') rotateTree() {
    this.state.tree && this.state.tree.rotateY(0.03)
  }
  
  @WhileDown('w') moveForward() {
    this.state.tree && this.state.tree.translateX(0.03)
  }

  constructor() {
    super()
    this.setCastShadow(true)
    this.setReceiveShadow(true)
    //this.sunLight.shadow.mapSize.set(2048, 2048)
    const loader = new GLTFLoader();
    loader.load('/campfire.glb', ({ scene: model, scenes }) => {
      model.traverse((c: any) => c.material ? c.material.metalness = 0 : null)
      this.state.campfire = model
    });
    loader.load('/tree.glb', ({ scene: model, scenes }) => {
      model.traverse((c: any) => c.material ? c.material.metalness = 0 : null)
      model.scale.y = 0.75
      model.translateX(1.2).translateZ(-0.8)
      this.state.tree = model
    });
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
      this.state.campfire,
      this.state.tree,
      //this.axesHelper,
      this.chao
    ]
  }
}