import GlobalEngineContext from '../GlobalEngineContext'
import SceneManipulator, { SupportedRenderReturnType } from '../SceneManipulator'

interface GameElementChild {
  _void: null
  state?: any
  render?: () => SupportedRenderReturnType
  tick?(elapsedTime?: number): () => void
}

export default class GameElement {

  _void: null
  props: any = {}
  sceneManipulator = new SceneManipulator()
  child: GameElementChild = this
  readonly elementName = this.child.constructor.name
  isInScene: boolean = false

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
    if(this.child.state && this.child.state.constructor.name != 'Proxy') {
      this.child.state = new Proxy(this.child.state || {}, {
        set: (target: any, key: string, value: any) => {
          target[key] = value
          this.isInScene && this.wrapRender()
          return true
        }
      } as any)
    }
    
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
