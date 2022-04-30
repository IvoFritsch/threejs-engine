import * as THREE from 'three'
import GameElement from "./elements/GameElement";
import { Object3D } from "three";
import Engine from './Engine';

type ArrayOfElementsOrObject3D = (THREE.Object3D | GameElement)[]

export type SupportedRenderReturnType = GameElement | GameElement[] | THREE.Object3D | THREE.Object3D[] | ArrayOfElementsOrObject3D

export default class SceneManipulator {

  private castShadow: boolean = null
  private receiveShadow: boolean = null
  private controlledObjects: ArrayOfElementsOrObject3D = []
  private engine: Engine
  private parent: GameElement

  private lastApplyedCastShadow = this.castShadow
  private lastApplyedReceiveShadow = this.receiveShadow

  constructor(father: GameElement) {
    this.parent = father
  }

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

    const gameElementsToRemove = removeFromScene.filter(e => e instanceof GameElement)
    const gameElementsToAdd = addToScene.filter(e => e instanceof GameElement)
    let anythingChanged = false

    const scene = this.engine.getScene()
    if(threeObjectsToRemove.length) {
      scene.remove.apply(scene, threeObjectsToRemove)
    }
    if(threeObjectsToAdd.length) {
      scene.add.apply(scene, threeObjectsToAdd)
    }
    gameElementsToAdd.forEach((ge: GameElement) => {
      ge.setEngine(this.engine)
      ge.setParent(this.parent)
      ge.wrapOnEnterScene()
      ge.requestRender()
    })
    gameElementsToRemove.forEach((ge: GameElement) => ge.wrapOnExitScene())
    anythingChanged = !!(threeObjectsToRemove.length | threeObjectsToAdd.length | gameElementsToAdd.length | gameElementsToRemove.length)
    this.controlledObjects = newRet
    if(anythingChanged) this.applyShadowsConfig()
  }

  applyShadowsConfig() {
    this.controlledObjects.filter(o => o instanceof Object3D).forEach((o: Object3D) => {
      o.traverse(e => {
        if(!(e as any).isLight) {
          e.receiveShadow = this.receiveShadow != undefined ? this.receiveShadow : e.receiveShadow
        }
        if(!(e as any).isAmbientLight) {
          e.castShadow = this.castShadow != undefined ? this.castShadow : e.castShadow
        }
      })
    })
    this.controlledObjects.filter(o => o instanceof GameElement).forEach((o: GameElement) => {
      o.setCastShadow(this.castShadow)
      o.setReceiveShadow(this.castShadow)
    })
    this.lastApplyedCastShadow = this.castShadow
    this.lastApplyedReceiveShadow = this.receiveShadow
  }

  clearScene() {
    this.computeAndApplyDiff([])
  }

  setCastShadow(v: boolean) {
    this.castShadow = v
    this.parent.requestRender()
  }

  setReceiveShadow(v: boolean) {
    this.receiveShadow = v
    this.parent.requestRender()
  }
  
  getCastShadow() {
    return this.castShadow
  }
  
  getReceiveShadow() {
    return this.receiveShadow
  }

  setEngine(engine: Engine) {
    this.engine = engine
  }

}

