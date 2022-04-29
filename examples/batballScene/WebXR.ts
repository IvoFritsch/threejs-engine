import * as THREE from 'three'
import GlobalEngineContext from '../../src/engine/GlobalEngineContext'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'

export default class WebXR {
  private renderer: THREE.WebGLRenderer
  private onSessionStartListeners: Function[] = []

  constructor() {
    this.renderer = GlobalEngineContext.engine.getRenderer()
    this.renderer.xr.enabled = true
    this.renderer.xr.addEventListener('sessionstart', () =>
      this.onSessionStartListeners.forEach(listener => listener())
    )

    document.body.appendChild(VRButton.createButton(this.renderer))
  }

  getGrip() {
    const grip = this.renderer.xr.getController(0)
    return grip
  }

  onSessionStart(listener: Function) {
    this.onSessionStartListeners.push(listener)
  }
}
