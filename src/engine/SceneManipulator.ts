import * as THREE from 'three'
import GameElement from "./elements/GameElement";
import GlobalEngineContext from "./GlobalEngineContext";
import { Object3D } from "three";

type ArrayOfElementsOrObject3D = (THREE.Object3D | GameElement)[]

export type SupportedRenderReturnType = GameElement | GameElement[] | THREE.Object3D | THREE.Object3D[] | ArrayOfElementsOrObject3D

export default class SceneManipulator {

  private castShadow: boolean = null
  private receiveShadow: boolean = null
  private controlledObjects: ArrayOfElementsOrObject3D = []

  applyRenderReturn(ret: SupportedRenderReturnType) {
    ret = this.normalizeRenderReturn(ret)
    this.computeAndApplyDiff(ret)
  }

  private normalizeRenderReturn(ret: SupportedRenderReturnType): ArrayOfElementsOrObject3D {
    if(!ret) return []
    if(ret.constructor.name == 'Array') {
      ret = (ret as Array<any>).flat(1)
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
    
    if(this.castShadow != null || this.receiveShadow != null) {
      threeObjectsToAdd.forEach((o: Object3D) => {
        if(!(o as any).isLight) {
          o.receiveShadow = this.receiveShadow != undefined ? this.receiveShadow : o.receiveShadow
        }
        if(!(o as any).isAmbientLight) {
          o.castShadow = this.castShadow != undefined ? this.castShadow : o.castShadow
        }
      })
    }

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
      ge.wrapOnEnterScene()
      ge.wrapRender()
  })
    gameElementsToRemove.forEach((ge: GameElement) => ge.wrapOnExitScene())
    this.controlledObjects = newRet
  }

  clearScene() {
    this.computeAndApplyDiff([])
  }

  setCastShadow(v: boolean) {
    this.castShadow = v
  }

  setReceiveShadow(v: boolean) {
    this.receiveShadow = v
  }

}

