import * as THREE from 'three'
import GameElement from "./GameElement"
import GlobalEngineContext from './GlobalEngineContext'

export default class Engine {

  private scene: THREE.Scene
  private clock: THREE.Clock
  private camera: THREE.Camera
  private renderer: THREE.WebGLRenderer
  private tickListeners: GameElement[] = []

  private rootElement: GameElement = null
  
  public readonly info: AppInfo

  constructor(target: HTMLCanvasElement, rootElement: typeof GameElement) {
    GlobalEngineContext.engine = this
    this.info = emptyAppInfo(target)
    this.rootElement = new rootElement()
    this.scene = new THREE.Scene()
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.info.target
    })
    this.renderer.setSize(this.info.sizes.width, this.info.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.clock = new THREE.Clock()
  }

  setCamera(camera: THREE.Camera) {
    this.camera = camera
    return this
  }

  getScene() {
    return this.scene
  }

  start() {
    this.rootElement.wrapRender()
    this.rootElement.onEnterScene()
    this.executeTick()

    return this
  }

  
  private executeTick() {  
    this.camera.position.z += 0.01
    this.tickListeners.forEach(e => e.wrapTick())
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