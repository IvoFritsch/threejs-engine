import * as THREE from 'three'
import GameElement from "./GameElement"
import GlobalEngineContext from './GlobalEngineContext'
import SceneManipulator from './SceneManipulator'

export default class Engine {

  private scene: THREE.Scene
  private clock: THREE.Clock
  private camera: THREE.Camera & { tick?: (elapsedTime?: number) => void }
  private renderer: THREE.WebGLRenderer
  private tickListeners: GameElement[] = []

  private rootElement: GameElement = null
  
  public readonly info: AppInfo

  constructor(target: HTMLCanvasElement, rootElement: typeof GameElement) {
    GlobalEngineContext.engine = this
    this.info = emptyAppInfo(target)
    this.scene = new THREE.Scene()
    this.rootElement = new rootElement()
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.info.target
    })
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(this.info.sizes.width, this.info.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.clock = new THREE.Clock()
  }

  setCamera(camera: THREE.Camera & { tick?: () => void }) {
    this.camera = camera
    return this
  }

  getScene() {
    return this.scene
  }

  start() {
    this.rootElement.onEnterScene()
    this.rootElement.wrapRender()
    this.executeTick()

    return this
  }

  
  private executeTick() {  
    const elapsedTime = this.clock.getElapsedTime()
    if(this.camera.tick) {
      this.camera.tick(elapsedTime)
    }

    this.tickListeners.forEach(e => e.wrapTick(elapsedTime))
    // Render
    this.renderer.render(this.scene, this.camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(() => this.executeTick())
  }

  addTickListener(element: GameElement) {
    this.tickListeners.push(element)
  }

  removeTickListener(element: GameElement) {
    this.tickListeners.splice(this.tickListeners.indexOf(element), 1)
  }
}

const emptyAppInfo = (target: HTMLCanvasElement): AppInfo => ({
  target,
  sizes: {
    width: target.clientWidth,
    height: target.clientHeight
  }
})

interface AppInfo {
  readonly target: HTMLCanvasElement
  readonly sizes: {
    readonly width: number
    readonly height: number
  }
}