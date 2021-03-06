import * as THREE from 'three'
import GameElement from './elements/GameElement'
import Stats from 'three/examples/jsm/libs/stats.module'
import PhysicsWorld, { PhysicsWorldOptions } from './PhysicsWorld'
import WebXR from './WebXR'
import GUI from 'lil-gui'

export default class Engine {
  private gui: GUI
  private physicsWorld: PhysicsWorld
  private scene: THREE.Scene
  private clock: THREE.Clock
  private camera: THREE.Camera & { tick?: (elapsedTime?: number) => void }
  private renderer: THREE.WebGLRenderer
  private tickListeners: GameElement[] = []
  private stats: Stats
  private webxr: WebXR
  public static currentAdjustMultiplier: number

  private rootElement: GameElement = null
  private rootElementConstructor: typeof GameElement

  private lastElapsedTime: number = 0

  public readonly info: AppInfo

  constructor(target: HTMLCanvasElement, rootElementConstructor: typeof GameElement) {
    this.info = emptyAppInfo(target)
    this.scene = new THREE.Scene()
    this.rootElementConstructor = rootElementConstructor

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.info.target,
      antialias: true,
    })
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(this.info.sizes.width, this.info.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.clock = new THREE.Clock()
  }

  enableWebxr() {
    this.webxr = new WebXR(this)
    return this
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

  enableGUI() {
    this.gui = new GUI()
    return this
  }

  setCamera(camera: THREE.Camera & { tick?: () => void }) {
    this.camera = camera
    return this
  }

  getScene() {
    return this.scene
  }

  getRenderer() {
    return this.renderer
  }

  getGui() {
    return this.gui
  }

  getCamera() {
    return this.camera
  }

  getPhysicsWorld() {
    return this.physicsWorld
  }

  getWebxr() {
    return this.webxr
  }

  start() {
    this.rootElement = new this.rootElementConstructor()
    this.rootElement.setEngine(this)
    this.rootElement.wrapOnEnterScene()
    this.rootElement.requestRender()
    this.renderer.setAnimationLoop(() => this.executeTick())

    return this
  }

  private executeTick() {
    const elapsedTime = this.clock.getElapsedTime()
    const deltaElapsedTime = elapsedTime - this.lastElapsedTime
    Engine.currentAdjustMultiplier = deltaElapsedTime / (1 / 60)
    this.lastElapsedTime = elapsedTime
    if (this.camera && this.camera.tick) {
      this.camera.tick(elapsedTime)
    }

    this.physicsWorld?.tick(elapsedTime, deltaElapsedTime)
    this.tickListeners.forEach(e => e.wrapTick(elapsedTime))
    if (this.camera) {
      this.renderer.render(this.scene, this.camera)
    }
    this.stats?.update()
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

export function adjustToTickTime(scalar: number) {
  return scalar * Engine.currentAdjustMultiplier
}
