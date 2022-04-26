import * as THREE from 'three'
import GlobalEngineContext from './GlobalEngineContext'
import SceneManipulator, { SupportedRenderReturnType } from './SceneManipulator'

interface GameElementChild {
  _void: null
  render?: () => SupportedRenderReturnType
  tick?(): () => void
}

export default class GameElement implements GameElementChild {

  _void: null
  state: any = {}
  props: any = {}
  sceneManipulator = new SceneManipulator()
  child: GameElementChild = this

  constructor() {
    this.state = new Proxy(this.state, {
      set: (target: any, key: string, value: any) => {
        target[key] = value
        this.wrapRender()
        return true
      }
    } as any)
  }

  public wrapRender() {
    if(!this.child.render) return

    const ret = this.child.render()
    this.sceneManipulator.applyRenderReturn(ret)

  }

  public wrapTick() {
    if(!this.child.tick) return
    this.child.tick()
  }
  
  public onEnterScene() {
    GlobalEngineContext.engine.addTickListener(this)

  }

  public onExitScene() {
    GlobalEngineContext.engine.removeTickListener(this)
    this.sceneManipulator.clearScene()
  }

}
