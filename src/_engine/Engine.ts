import * as THREE from 'three'
import { GameWorld } from './GameWorld'

interface OnTickParams {
  camera: THREE.Camera,
  scene: THREE.Scene,
  elapsedTime: number
}

export default class Engine extends GameWorld {

  protected scene: THREE.Scene
  protected camera: THREE.Camera
  private readonly tickCallbacks: ((params?: OnTickParams) => void)[] = []
  private readonly configureSceneCallbacks: ((scene: THREE.Scene) => Promise<void>)[] = []
  private overrideConfigureCameraCallback: (scene: THREE.Scene) => void = null
  private afterConfigureCameraCallback: (camera: THREE.Camera) => void = null

  private target: HTMLCanvasElement = null
  private clock: THREE.Clock = null
  private sizes: {
    width: number
    height: number
  }

  private renderer: THREE.WebGLRenderer

  constructor(target: HTMLCanvasElement) {
    super()
    this.target = target
    this.sizes = {
      width: this.target.clientWidth,
      height: this.target.clientHeight
    }
  }

  onConfigureScene(callback: (scene: THREE.Scene) => Promise<void>) {
    this.configureSceneCallbacks.push(callback)
  }

  onTick(callback: (params?: OnTickParams) => void) {
    this.tickCallbacks.push(callback)
  }

  overrideConfigureCamera(callback: (scene: THREE.Scene) => void) {
    this.overrideConfigureCameraCallback = callback
  }

  afterConfigureCamera(callback: (camera: THREE.Camera) => void) {
    this.afterConfigureCameraCallback = callback
  }

  public async start() {
    await this.configureScene()
    this.configureRenderer()
    this.clock = new THREE.Clock()
    this.executeTick()
  }

  private async configureScene() {
    this.scene = new THREE.Scene()
    this.configureCamera()
    for (const c of this.configureSceneCallbacks) {
      await c(this.scene)
    }
  }

  private configureCamera() {
    if(this.overrideConfigureCameraCallback) {
      this.overrideConfigureCameraCallback(this.scene)
    } else {      
      this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
      this.scene.add(this.camera)
      if(this.afterConfigureCameraCallback) this.afterConfigureCameraCallback(this.camera)
    }

  }

  private configureRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.target
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  private executeTick() {
    
    const params = {
      elapsedTime: this.clock.getElapsedTime(),
      camera: this.camera,
      scene: this.scene
    }
    for (const c of this.tickCallbacks) {
      c(params)
    }

    // Update controls
    // controls.update()

    // Render
    this.renderer.render(this.scene, this.camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(() => this.executeTick())
  }

}