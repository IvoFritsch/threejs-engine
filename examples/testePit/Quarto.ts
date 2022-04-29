import GameElement from "../../src/engine/elements/GameElement";
import * as THREE from 'three'
import { MathUtils } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class Quarto extends GameElement {

  parede1 = new THREE.Mesh(
    new THREE.PlaneGeometry(3,3)
      .translate(1.5, 1.5, 0),
    new THREE.MeshStandardMaterial({ color: 'red', side: THREE.DoubleSide })
  )
  
  parede2 = this.parede1.clone()
            .rotateY(MathUtils.degToRad(-90))

  chao = this.parede2.clone()
            .rotateX(MathUtils.degToRad(-90))

  luz = new THREE.PointLight(0xffffff, 0.6).translateY(2.5).translateX(1.5).translateZ(1.5)
  luzHelper = new THREE.PointLightHelper(this.luz)

  constructor() {
    super()
    const loader = new GLTFLoader();
    loader.load('/soil.gltf', ({ scene: model }) => {
      const soil = model.getObjectByName('Cube001');
      (soil as any).material = new THREE.MeshStandardMaterial({ color: 0x602212 });
      soil.castShadow = true
      soil.receiveShadow = true
    });
  }

  onEnterScene() {
    // const int = setInterval(() => { this.state.isShowing = !this.state.isShowing }, 400)
    // return () => clearInterval(int)
  }

  render() {
    return [
      this.parede1,
      this.parede2,
      this.chao,
      [this.luz, this.luzHelper],
      
    ]
  }
}