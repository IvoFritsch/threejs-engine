import * as THREE from 'three'
import SmartSceneManipulator, { SupportedRenderReturnType } from './SceneManipulator'

interface GameElementChild {
  _void: null
  render?: () => SupportedRenderReturnType
}

export default class GameElement implements GameElementChild {

  _void: null
  state: any = {}
  props: any = {}
  sceneManipulator = new SmartSceneManipulator()
  child: GameElementChild = this

  static tickListeners: (() => void)[] = []

  constructor() {
    this.state = new Proxy(this.state, {
      set: (target: any, key: string, value: any) => {
        target[key] = value
      }
    } as any)
  }

  public wrapRender() {
    if(!this.child.render) return

    const ret = this.child.render()
    this.sceneManipulator.applyRenderReturn(ret)

  }

  public wrapTick() {
    //if(!this.child.tick) return
    GameElement.tickListeners.forEach(fn => fn.apply(this))
    //this.child.tick()
  }

  registerTickListener(fn: () => void) {
    GameElement.tickListeners.push(fn)
  }
  

}
