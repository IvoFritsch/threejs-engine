import Engine from '../Engine'
import SceneManipulator, { SupportedRenderReturnType } from '../SceneManipulator'

interface GameElementChild {
  state?: any
  onEnterScene?: () => () => void
  onExitScene?: () => {}
  render?: () => SupportedRenderReturnType
  tick?(elapsedTime?: number): () => void
}

export default class GameElement {
  private renderTimeout: NodeJS.Timeout = null

  public engine: Engine
  private sceneManipulator = new SceneManipulator(this)
  private child: GameElementChild = this as GameElementChild
  private readonly elementName = this.child.constructor.name
  protected isInScene: boolean = false

  beforeExitSceneCallback: () => void = null

  public requestRender() {
    clearTimeout(this.renderTimeout)
    this.renderTimeout = setTimeout(this.wrapRender.bind(this), 15);
  }

  private wrapRender() {
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
          this.isInScene && this.requestRender()
          return true
        }
      } as any)
    }
    
    this.isInScene = true
    this.engine.addTickListener(this)
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
    this.engine.removeTickListener(this)
    this.sceneManipulator.clearScene()
    this.isInScene = false
  }

  public getElementName() {
    return this.elementName
  }

  public setEngine(engine: Engine) {
    this.engine = engine
    this.sceneManipulator.setEngine(engine)
  }

  public getEngine() {
    return this.engine
  }

}
