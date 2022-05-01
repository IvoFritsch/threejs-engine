import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import GameElement from '../../src/engine/elements/GameElement'
import ThrowDirection from './ThrowDirection'
import Player from './Player'
import Dolly from './Dolly'

export default class ThrowObjects extends GameElement {
  camera: THREE.Camera
  player: DefaultPhysicsElement
  direction: '+x' | '-x' | '+z' | '-z'
  throwSphereTimeout: NodeJS.Timeout

  sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
  sphereMaterial = new THREE.MeshToonMaterial()

  state: { spheres: DefaultPhysicsElement[] } = {
    spheres: [],
  }

  constructor(dolly: Dolly, player: Player, throwDirection: ThrowDirection) {
    super()
    this.player = player.getPlayer()

    throwDirection.onDirectionChange((direction: '+x' | '-x' | '+z' | '-z') =>
      this.onDirectionChange(direction)
    )

    dolly.onDollyOutsideAllowedArea(() => this.onPlayerOutsideAllowedArea())
  }

  onEnterScene() {
    this.camera = this.engine.getCamera()
  }

  onDirectionChange(direction: '+x' | '-x' | '+z' | '-z') {
    clearTimeout(this.throwSphereTimeout)
    this.direction = direction
    this.state.spheres = []
    this.throwSphere()
  }

  async onPlayerOutsideAllowedArea() {
    clearTimeout(this.throwSphereTimeout)
    this.state.spheres = []
  }

  getDistance() {
    return (Math.random() - 0.5) * 20
  }

  throwSphere() {
    const nextThrow = this.getRandomBetween(1000, 3000)

    this.throwSphereTimeout = setTimeout(() => {
      const sphere = this.createSphere()
      this.setSpherePosition(sphere)

      const playerHeight = this.camera.position.y

      const xDirection = this.camera.position.x - sphere.position.x
      const zDirection = this.camera.position.z - sphere.position.z
      const yDirection = this.getRandomBetween(0, playerHeight)

      sphere.body.applyLocalImpulse(
        new CANNON.Vec3(xDirection, yDirection, zDirection),
        new CANNON.Vec3(0, 0, 0)
      )

      this.state.spheres = [...this.state.spheres, sphere]

      this.throwSphere()
    }, nextThrow)
  }

  setSpherePosition(sphere: DefaultPhysicsElement) {
    const units = 20
    const distance = this.getDistance()

    sphere.position.y = 5
    switch (this.direction) {
      case '+x':
        sphere.position.x = units
        sphere.position.z = distance
        break
      case '-x':
        sphere.position.x = -units
        sphere.position.z = distance
        break
      case '+z':
        sphere.position.x = distance
        sphere.position.z = units
        break
      case '-z':
        sphere.position.x = distance
        sphere.position.z = -units
        break
      default:
        sphere.position.x = units
        sphere.position.z = distance
    }
  }

  createSphere() {
    const radius = this.getRandomBetween(0.1, 0.9)

    const sphere = new DefaultPhysicsElement(
      new THREE.Mesh(this.sphereGeometry, this.sphereMaterial),
      { mass: 1, shape: new CANNON.Sphere(radius) }
    )
    sphere.mesh.scale.set(radius, radius, radius)
    sphere.mesh.castShadow = true

    return sphere
  }

  getRandomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  render() {
    return this.state.spheres
  }
}
