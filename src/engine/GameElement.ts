import * as THREE from 'three'
import GlobalEngineContext from './GlobalEngineContext'
import SceneManipulator, { SupportedRenderReturnType } from './SceneManipulator'

interface GameElementChild {
  _void: null
  render?: () => SupportedRenderReturnType
  tick?(elapsedTime?: number): () => void
}

export default class GameElement implements GameElementChild {

  _void: null
  state: any = {}
  props: any = {}
  sceneManipulator = new SceneManipulator()
  child: GameElementChild = this
  isInScene: boolean = false

  constructor() {
    this.state = new Proxy(this.state, {
      set: (target: any, key: string, value: any) => {
        target[key] = value
        this.isInScene && this.wrapRender()
        return true
      }
    } as any)
  }

  public wrapRender() {
    if(!this.child.render) return

    const ret = this.child.render()
    this.sceneManipulator.applyRenderReturn(ret)
  }

  public wrapTick(elapsedTime: number) {
    if(!this.child.tick) return
    this.child.tick(elapsedTime)
  }
  
  public onEnterScene() {
    this.isInScene = true
    GlobalEngineContext.engine.addTickListener(this)
  }

  protected setCastShadow(v: boolean) {
    this.sceneManipulator.setCastShadow(v)
  }

  protected setReceiveShadow(v: boolean) {
    this.sceneManipulator.setReceiveShadow(v)
  }

  public onExitScene() {
    GlobalEngineContext.engine.removeTickListener(this)
    this.sceneManipulator.clearScene()
    this.isInScene = false
  }

}
