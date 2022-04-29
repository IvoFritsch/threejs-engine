import GameElement from "../../src/engine/elements/GameElement";
import * as THREE from 'three'
import Quarto from "./Quarto";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MathUtils, Object3D } from "three";

export default class Base extends GameElement {

  chao = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({color: 0x554d46})
  ).rotateX(MathUtils.degToRad(-90))

  sunLight = new THREE.DirectionalLight(0xffffff, 0.6)
                .translateY(20)
                .translateX(20)
                .translateZ(20)
  ambientLight = new THREE.AmbientLight(0xffffff, 0.9)

  axesHelper = new THREE.AxesHelper( 5 );

  state = {
    campfire: null as Object3D
  }

  constructor() {
    super()
    this.setCastShadow(true)
    this.setReceiveShadow(true)
    const loader = new GLTFLoader();
    loader.load('/campfire.glb', ({ scene: model, scenes }) => {
      console.log(model, scenes);
      model.traverse((c: any) => c.material ? c.material.metalness = 0 : null)
      this.state.campfire = model
      // const soil = model.getObjectByName('Cube001');
      // (soil as any).material = new THREE.MeshStandardMaterial({ color: 0x602212 });
      // soil.castShadow = true
      // soil.receiveShadow = true
      // this.state.soil = soil
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
      [this.sunLight, new THREE.DirectionalLightHelper(this.sunLight)],
      this.state.campfire,
      this.axesHelper,
      this.chao
    ]
  }
}