import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import GameElement from '../../src/engine/elements/GameElement'
import GlobalEngineContext from '../../src/engine/GlobalEngineContext'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import Bat from './Bat'
import Player from './Player'
import WebXR from './WebXR'
import gsap from 'gsap'

export default class Dolly extends GameElement {
  private dolly = new THREE.Group()
  private webxr: WebXR
  private player: DefaultPhysicsElement
  private bat: Bat
  private collisionTween: gsap.core.Tween

  private onDollyOutsideAllowedAreaListeners: Function[] = []
  private callDollyOutsideAllowedAreaListenerTime: number = 0

  state: { grip: DefaultPhysicsElement } = {
    grip: undefined,
  }

  constructor(webxr: WebXR, player: Player, bat: Bat) {
    super()
    this.webxr = webxr
    this.player = player.getPlayer()
    this.bat = bat

    this.webxr.onSessionStart(() => this.onSessionStart())
    player.onPlayerCollision((body: CANNON.Body) => this.onPlayerCollision(body))
  }

  private onPlayerCollision(body: any) {
    if (!this.state.grip) return

    const { x, z } = body.velocity
    const force = 0.15
    this.collisionTween = gsap.to(this.dolly.position, {
      x: `+=${x * force}`,
      z: `+=${z * force}`,
    })

    // Change color of object that hit player
    // for (const object of objectsToUpdate) {
    //     if (body.shapes[0].body === object.body) {
    //         object.mesh.material = new THREE.MeshToonMaterial({ color: 0xf1ba79 })
    //         break
    //     }
    // }
  }

  private onSessionStart() {
    const camera = GlobalEngineContext.engine.getCamera()
    const player = this.player.mesh
    const bat = this.bat.getBat()
    const grip = this.webxr.getGrip()
    grip.add(bat)

    this.state.grip = new DefaultPhysicsElement(grip, {
      wireframe: true,
      shape: new CANNON.Cylinder(0.06, 0.06, 1.33),
      positionOffset: new CANNON.Vec3(0, 0, -0.48),
      quaternionOffset: new CANNON.Quaternion(0.7068252, 0, 0, 0.7073883),
    })
    this.state.grip.updateBodyToMesh = false
    this.state.grip.updatePosition = false

    this.dolly.add(camera, player, this.state.grip.mesh)
  }

  private checkDollyOutsideAllowedArea(elapsedTime: number) {
    if (
      this.dolly.position.x <= 5 &&
      this.dolly.position.x >= -5 &&
      this.dolly.position.z <= 5 &&
      this.dolly.position.z >= -5
    )
      return

    const passedSeconds = elapsedTime - this.callDollyOutsideAllowedAreaListenerTime
    if (passedSeconds < 1) return
    this.callDollyOutsideAllowedAreaListenerTime = elapsedTime

    this.resetDollyPosition()

    this.onDollyOutsideAllowedAreaListeners.forEach(listener => listener())
  }

  private resetDollyPosition() {
    this.collisionTween.kill()
    this.dolly.position.z = 0
    this.dolly.position.x = 0
  }

  getDolly() {
    return this.dolly
  }

  onDollyOutsideAllowedArea(listener: Function) {
    this.onDollyOutsideAllowedAreaListeners.push(listener)
  }

  tick(elapsedTime: number) {
    this.checkDollyOutsideAllowedArea(elapsedTime)

    if (this.state.grip) {
      this.state.grip.body.position.set(
        this.state.grip.mesh.position.x + this.dolly.position.x,
        this.state.grip.mesh.position.y + this.dolly.position.y,
        this.state.grip.mesh.position.z + this.dolly.position.z
      )

      this.player.body.position.set(
        this.player.mesh.position.x + this.dolly.position.x,
        this.player.mesh.position.y + this.dolly.position.y,
        this.player.mesh.position.z + this.dolly.position.z
      )
    }
  }

  render() {
    return [this.dolly, this.state.grip]
  }
}
