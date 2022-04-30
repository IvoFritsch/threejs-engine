import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Bat {
  private loader = new GLTFLoader()
  private bat: THREE.Object3D

  constructor() {
    this.loadBat()
  }

  private loadBat() {
    this.loader.load('/models/bat.glb', ({ scene: model }) => {
      this.bat = model.getObjectByName('bat')
    })
  }

  getBat() {
    return this.bat
  }
}
