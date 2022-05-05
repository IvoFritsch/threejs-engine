import KeyboardKey from '../controls/KeyboardKey'
import { KeyCode } from '../controls/KeyCode'
import Engine from '../Engine'
import SceneManipulator, { SupportedRenderReturnType } from '../SceneManipulator'
import { v4 as uuidv4 } from 'uuid'

interface GameElementChild {
  state?: any
  onEnterScene?: () => () => void
  onExitScene?: () => {}
  render?: () => SupportedRenderReturnType
  tick?(elapsedTime?: number): () => void
}

export default class GameElement {
  private renderTimeout: NodeJS.Timeout = null

  public readonly uuid = uuidv4()
  public engine: Engine
  private sceneManipulator = new SceneManipulator(this)
  private child: GameElementChild = this as GameElementChild
  private parent: GameElement
  private readonly elementName = this.child.constructor.name
  protected isInScene: boolean = false

  private static decoratorsInGameElements = new Map<typeof GameElement, SubClassDecorators>()

  beforeExitSceneCallback: () => void = null

  public requestRender() {
    clearTimeout(this.renderTimeout)
    this.renderTimeout = setTimeout(this.wrapRender.bind(this), 15);
  }

  private wrapRender() {
    if(!this.child.render) return
    if(!this.isInScene) return
    const ret = this.child.render()
    this.sceneManipulator.applyRenderReturn(ret)
  }

  public wrapTick(elapsedTime: number) {
    const childDecorators = GameElement.decoratorsInGameElements.get(this.constructor as typeof GameElement)
    if(childDecorators) {
      //console.log(childDecorators) //this.constructor, GameElement.decoratorsInGameElements)
      if(childDecorators.whileDown) {
        childDecorators.whileDown.forEach((member, k) => {
          if(KeyboardKey.isDown(k)) {
            (this.child as any)[member](elapsedTime)
          }
        })
      }
      if(childDecorators.whileUp) {
        childDecorators.whileUp.forEach((member, k) => {
          if(KeyboardKey.isUp(k)) {
            (this.child as any)[member](elapsedTime)
          }
        })
      }
    }

    if(this.child.tick) {
      this.child.tick(elapsedTime)
    }
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

  public setCastShadow(v: boolean) {
    //console.log(this.elementName, 'setCastShadow', v)
    this.sceneManipulator.setCastShadow(v)
  }

  public setReceiveShadow(v: boolean) {
    //console.log(this.elementName, 'setReceiveShadow', v)
    this.sceneManipulator.setReceiveShadow(v)
  }

  public getCastShadow() {
    return this.sceneManipulator.getCastShadow()
  }

  public getReceiveShadow() {
    return this.sceneManipulator.getReceiveShadow()
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

  public getParent<T extends GameElement>(): T {
    return this.parent as T
  }

  public setParent(parent: GameElement) {
    this.parent = parent
  }

  public static registerWhileKeySubclassFunction(
    subclass: typeof GameElement, 
    key: KeyCode, 
    memberName: string, 
    type: 'whileUp' | 'whileDown'
  ) {
    let decorators = GameElement.decoratorsInGameElements.get(subclass)
    if(!decorators) {
      decorators = {}
      GameElement.decoratorsInGameElements.set(subclass, decorators)
    }
    if(!decorators[type]) {
      decorators[type] = new Map()
    }
    decorators[type].set(key, memberName)
  }
}

interface SubClassDecorators {
  whileUp?: Map<KeyCode, string>
  whileDown?: Map<KeyCode, string>
}
