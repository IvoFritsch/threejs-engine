import Engine from "./Engine";
import * as THREE from 'three'
import GameElement from "./GameElement";
import GlobalEngineContext from "./GlobalEngineContext";
import { Object3D } from "three";

type ArrayOfElementsOrObject3D = (THREE.Object3D | GameElement)[]

export type SupportedRenderReturnType = GameElement | GameElement[] | THREE.Object3D | THREE.Object3D[] | ArrayOfElementsOrObject3D

export default class SceneManipulator {

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
    const removeFromScene = this.controlledObjects.filter(e => !newRet.includes(e))

    const threeObjectsToRemove = removeFromScene.filter(e => e instanceof Object3D)
    const threeObjectsToAdd = addToScene.filter(e => e instanceof Object3D)

    const gameElementsToRemove = removeFromScene.filter(e => e instanceof GameElement)
    const gameElementsToAdd = addToScene.filter(e => e instanceof GameElement)


    const scene = GlobalEngineContext.engine.getScene()
    if(threeObjectsToRemove.length) {
      scene.remove.apply(scene, threeObjectsToRemove)
    }
    if(threeObjectsToAdd.length) {
      scene.add.apply(scene, threeObjectsToAdd)
    }
    gameElementsToAdd.forEach((ge: GameElement) => {
      ge.wrapRender()
      ge.onEnterScene()
    })
    gameElementsToRemove.forEach((ge: GameElement) => ge.onExitScene())
    this.controlledObjects = newRet
  }

  clearScene() {
    this.computeAndApplyDiff([])
  }

}

