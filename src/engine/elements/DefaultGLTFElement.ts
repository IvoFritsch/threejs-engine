import * as THREE from 'three'
import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import GameElement from "./GameElement";

interface OnLoadProps {
  model: THREE.Group,
  helpers: {
    traverseMaterials: (callback: (m: THREE.Material) => void) => void
  }
}

export default class DefaultGLTFElement extends GameElement {

  private static loader = new GLTFLoader();

  private path: string
  private onLoad: (props: OnLoadProps) => THREE.Group | void
  public isLoaded: boolean
  private state = {
    mesh: null as Object3D
  }

  constructor(path: string, onLoad?: (props: OnLoadProps) => THREE.Group | void) {
    super()
    this.path = path
    this.onLoad = onLoad
  }

  onEnterScene() {
    DefaultGLTFElement.loader.load(this.path, ({ scene: model }) => {
      let putOnScene = model
      if(this.onLoad) {
        const ret = this.onLoad({ 
          model, 
          helpers: {
            traverseMaterials: (c) => model.traverse((o: any) => o.material && c(o.material))
          }
        })
        if(ret) {
          putOnScene = ret
        }
      }
      this.state.mesh = putOnScene
      this.isLoaded = true
    })
  }

  getMesh() {
    return this.state.mesh
  }

  render() {
    return [this.state.mesh]
  }
}