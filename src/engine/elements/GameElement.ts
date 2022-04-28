import GlobalEngineContext from '../GlobalEngineContext'
import SceneManipulator, { SupportedRenderReturnType } from '../SceneManipulator'

interface GameElementChild {
  _void: null
  state?: any
  onEnterScene?: () => () => void
  onExitScene?: () => {}
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

  beforeExitSceneCallback: () => void = null

  public wrapRender() {
    if(!this.child.render) return

    const ret = this.child.render()
    this.sceneManipulator.applyRenderReturn(ret)
  }

  public wrapTick(elapsedTime: number) {
    if(!this.child.tick) return
    this.child.tick(elapsedTime)
  }
  
  public wrapOnEnterScene() {
    if(this.child.onEnterScene) {
      this.beforeExitSceneCallback = this.child.onEnterScene()
    }
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

  public wrapOnExitScene() {
    if(this.beforeExitSceneCallback) {
      this.beforeExitSceneCallback()
      this.beforeExitSceneCallback = null
    }
    if(this.child.onExitScene) {
      this.child.onExitScene()
    }
    GlobalEngineContext.engine.removeTickListener(this)
    this.sceneManipulator.clearScene()
    this.isInScene = false
  }

}
