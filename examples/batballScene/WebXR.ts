import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import Engine from '../../src/engine/Engine'

export default class WebXR {
  private renderer: THREE.WebGLRenderer
  private onSessionStartListeners: Function[] = []

  constructor(engine: Engine) {
    this.renderer = engine.getRenderer()
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
