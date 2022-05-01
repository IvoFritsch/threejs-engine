import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import GameElement from '../../src/engine/elements/GameElement'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import Bat from './Bat'
import Player from './Player'
import gsap from 'gsap'
import WebXR from '../../src/engine/WebXR'

export default class Dolly extends GameElement {
  private dolly = new THREE.Group()
  private webxr: WebXR
  private player: DefaultPhysicsElement
  private camera: THREE.Camera
  private bat: Bat
  private collisionTween: gsap.core.Tween

  private onDollyOutsideAllowedAreaListeners: Function[] = []
  private callDollyOutsideAllowedAreaListenerTime: number = 0

  state: { grip: DefaultPhysicsElement } = {
    grip: undefined,
  }

  constructor(player: Player, bat: Bat) {
    super()
    this.bat = bat
    this.player = player.getPlayer()

    player.onPlayerCollision((body: CANNON.Body) => this.onPlayerCollision(body))
  }

  onEnterScene() {
    this.webxr = this.engine.getWebxr()
    this.webxr.onSessionStart(() => this.onSessionStart())
  }

  private onPlayerCollision(body: any) {
    if (!this.state.grip) return

    const { x, z } = body.velocity
    const force = 0.15
    this.collisionTween = gsap.to(this.dolly.position, {
      x: `+=${x * force}`,
      z: `+=${z * force}`,
    })
  }

  private onSessionStart() {
    this.camera = this.engine.getCamera()
    const grip = this.webxr.getGrip()
    grip.add(this.bat.getBat())

    this.state.grip = new DefaultPhysicsElement(
      grip,
      {
        shape: new CANNON.Cylinder(0.06, 0.06, 1.33),
        positionOffset: new CANNON.Vec3(0, 0, -0.48),
        quaternionOffset: new CANNON.Quaternion(0.7068252, 0, 0, 0.7073883),
      },
      {
        wireframe: true,
        renderMesh: false,
        updatePosition: false,
        updateDirection: 'meshToBody',
      }
    )

    this.dolly.add(this.camera, this.state.grip.mesh)
  }

  private checkDollyOutsideAllowedArea(elapsedTime: number) {
    if (
      !this.camera ||
      (this.camera.position.x <= 5 &&
        this.camera.position.x >= -5 &&
        this.camera.position.z <= 5 &&
        this.camera.position.z >= -5)
    )
      return

    const passedSeconds = elapsedTime - this.callDollyOutsideAllowedAreaListenerTime
    if (passedSeconds < 1) return
    this.callDollyOutsideAllowedAreaListenerTime = elapsedTime

    this.resetDollyPosition()

    this.onDollyOutsideAllowedAreaListeners.forEach(listener => listener())
  }

  private resetDollyPosition() {
    this.collisionTween?.kill()
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
    gsap.ticker.tick()
    this.checkDollyOutsideAllowedArea(elapsedTime)
    this.moveGrip()
    this.movePlayer()
  }

  moveGrip() {
    if (!this.state.grip) return
    this.state.grip.body.position.set(
      this.state.grip.mesh.position.x + this.dolly.position.x,
      this.state.grip.mesh.position.y + this.dolly.position.y,
      this.state.grip.mesh.position.z + this.dolly.position.z
    )
  }

  movePlayer() {
    if (!this.camera) return
    this.player.body.quaternion.set(
      0,
      this.camera.quaternion.y,
      0,
      this.camera.quaternion.w
    )

    this.player.body.position.set(
      this.camera.position.x,
      this.camera.position.y - this.player.mesh.position.y,
      this.camera.position.z
    )
  }

  render() {
    return [this.dolly, this.state.grip]
  }
}
