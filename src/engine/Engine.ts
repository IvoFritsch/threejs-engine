import * as THREE from 'three'
import GameElement from './elements/GameElement'
import GlobalEngineContext from './GlobalEngineContext'
import PhysicsWorld, { PhysicsWorldOptions } from './PhysicsWorld'
import Stats from 'three/examples/jsm/libs/stats.module'

export default class Engine {
  private physicsWorld: PhysicsWorld
  private scene: THREE.Scene
  private clock: THREE.Clock
  private camera: THREE.Camera & { tick?: (elapsedTime?: number) => void }
  private renderer: THREE.WebGLRenderer
  private tickListeners: GameElement[] = []
  private stats: Stats

  private rootElement: GameElement = null
  private rootElementConstructor: typeof GameElement

  private lastElapsedTime: number = 0

  public readonly info: AppInfo

  constructor(target: HTMLCanvasElement, rootElementConstructor: typeof GameElement) {
    GlobalEngineContext.engine = this
    this.info = emptyAppInfo(target)
    this.scene = new THREE.Scene()
    this.rootElementConstructor = rootElementConstructor

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.info.target,
    })
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(this.info.sizes.width, this.info.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.clock = new THREE.Clock()
  }

  enablePhysics(options: PhysicsWorldOptions) {
    this.physicsWorld = new PhysicsWorld(options)
    return this
  }

  enableStats(mode: 0 | 1 | 2 = 0) {
    this.stats = Stats()
    this.stats.setMode(mode)
    document.body.appendChild(this.stats.dom)
    return this
  }

  setCamera(camera: THREE.Camera & { tick?: () => void }) {
    this.camera = camera
    return this
  }

  getScene() {
    return this.scene
  }

  getPhysicsWorld() {
    return this.physicsWorld
  }

  start() {
    this.rootElement = new this.rootElementConstructor()
    this.rootElement.wrapOnEnterScene()
    this.rootElement.wrapRender()
    this.executeTick()

    return this
  }

  private executeTick() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaElapsedTime = elapsedTime - this.lastElapsedTime
    this.lastElapsedTime = elapsedTime

    if (this.camera.tick) {
      this.camera.tick(elapsedTime)
    }

    this.physicsWorld?.tick(elapsedTime, deltaElapsedTime)

    this.tickListeners.forEach(e => e.wrapTick(elapsedTime))

    this.renderer.render(this.scene, this.camera)

    this.stats?.update()

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
    width: window.innerWidth,
    height: window.innerHeight,
  },
})

interface AppInfo {
  readonly target: HTMLCanvasElement
  readonly sizes: {
    readonly width: number
    readonly height: number
  }
}
