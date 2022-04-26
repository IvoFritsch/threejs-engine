import Engine from "./Engine";
import * as THREE from 'three'
import GameElement from "./GameElement";
import GlobalEngineContext from "./GlobalEngineContext";

type ArrayOfElementsOrObject3D = (THREE.Object3D | GameElement)[]

export type SupportedRenderReturnType = GameElement | GameElement[] | THREE.Object3D | THREE.Object3D[] | ArrayOfElementsOrObject3D

export default class SmartSceneManipulator {

  private controlledObjects: ArrayOfElementsOrObject3D = []

  applyRenderReturn(ret: SupportedRenderReturnType) {
    ret = this.normalizeRenderReturn(ret)
    this.computeAndApplyDiff(ret)
  }

  private normalizeRenderReturn(ret: SupportedRenderReturnType): ArrayOfElementsOrObject3D {
    if(ret.constructor.name == 'Array') {
      return ret as ArrayOfElementsOrObject3D
    } else {
      return [ret as (THREE.Object3D | GameElement)]
    }
  }

  private computeAndApplyDiff(newRet: ArrayOfElementsOrObject3D) {
    const addToScene = newRet.filter(e => !this.controlledObjects.includes(e))
    const removeFromScene = this.controlledObjects.forEach(e => newRet.includes(e))

    const scene = GlobalEngineContext.engine.getScene()
    scene.remove.apply(scene, removeFromScene)
    scene.add.apply(scene, addToScene)
    this.controlledObjects = newRet
  }

}

