import * as THREE from 'three'
import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import LoadedElement, { OnLoadFunction } from './LoadedElement';
import GameElement from "./GameElement";

interface OnLoadProps {
  model: THREE.Group,
  helpers: {
    traverseMaterials: (callback: (m: THREE.Material) => void) => void
  }
}

export default class DefaultGLTFElement<T = Object3D> extends LoadedElement<T> {

  private static loader = new GLTFLoader();

  private path: string
  private onLoad: OnLoadFunction<T>
  private state = {
    toRender: null as T
  }

  constructor(path: string, onLoad?: OnLoadFunction<T>) {
    super()
    this.path = path
    this.onLoad = onLoad
    DefaultGLTFElement.loader.load(this.path, ({ scene: model }) => {
      let putOnScene: any = model
      if(this.onLoad) {
        const ret = this.wrapOnLoad({ 
          model
        }, this.onLoad)
        if(ret) {
          putOnScene = ret
        }
      }
      this.state.toRender = putOnScene
      this.isLoaded = true
    })
  }

  get() {
    return this.state.toRender
  }

  render() {
    return [this.state.toRender]
  }
}