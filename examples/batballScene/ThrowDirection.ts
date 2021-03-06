import * as THREE from 'three'
import GameElement from '../../src/engine/elements/GameElement'
import Dolly from './Dolly'

export default class ThrowDirection extends GameElement {
  direction: '+x' | '-x' | '+z' | '-z'
  lastDirection: '+x' | '-x' | '+z' | '-z'
  onDirectionChangeListeners: Function[] = []
  changeDirectionTimeout: NodeJS.Timeout

  directionMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 10),
    new THREE.MeshToonMaterial({ color: 0x156cff })
  )

  constructor(dolly: Dolly) {
    super()

    this.directionMesh.receiveShadow = true
    this.directionMesh.rotation.x = -Math.PI * 0.5
    this.directionMesh.position.y = 0.001

    this.changeDirection()

    dolly.onDollyOutsideAllowedArea(() => this.onPlayerOutsideAllowedArea())
  }

  async onPlayerOutsideAllowedArea() {
    clearTimeout(this.changeDirectionTimeout)

    this.directionMesh.material.color.set(0xff4d1a)
    await this.blinkDirectionMesh(10, 300)
    this.directionMesh.material.color.set(0x156cff)
    this.directionMesh.visible = false

    setTimeout(() => {
      this.directionMesh.visible = true
      this.direction = undefined
      this.changeDirection()
    }, 3000)
  }

  changeDirection() {
    const timeBetweenChanges = this.getRandomBetween(7000, 9000)
    this.changeDirectionAxis()
    this.checkDirectionAxisChange()

    clearTimeout(this.changeDirectionTimeout)
    this.changeDirectionTimeout = setTimeout(() => {
      this.changeDirection()
    }, timeBetweenChanges)
  }

  changeDirectionAxis() {
    this.lastDirection = this.direction

    const randomAxis = Math.round(Math.random() * 3)
    switch (randomAxis) {
      case 0:
        return (this.direction = '+x')
      case 1:
        return (this.direction = '-x')
      case 2:
        return (this.direction = '+z')
      case 3:
        return (this.direction = '-z')
      default:
        return (this.direction = '+x')
    }
  }

  blinkDirectionMesh(quantity: number, ms: number = 150): Promise<void> {
    return new Promise(resolve => {
      this.directionMesh.visible = !this.directionMesh.visible
      if (quantity > 0)
        setTimeout(async () => resolve(await this.blinkDirectionMesh(quantity - 1)), ms)
      else {
        this.directionMesh.visible = true
        resolve()
      }
    })
  }

  async checkDirectionAxisChange() {
    if (this.direction === this.lastDirection) return
    this.onDirectionChangeListeners.forEach(listener => listener(this.direction))
    this.updateDirectionMesh()
    await this.blinkDirectionMesh(5)
  }

  updateDirectionMesh() {
    switch (this.direction) {
      case '+x':
        this.directionMesh.position.x = 4.7
        this.directionMesh.position.z = 0
        this.directionMesh.rotation.z = 0
        break
      case '-x':
        this.directionMesh.position.x = -4.7
        this.directionMesh.position.z = 0
        this.directionMesh.rotation.z = 0
        break
      case '+z':
        this.directionMesh.position.x = 0
        this.directionMesh.position.z = 4.7
        this.directionMesh.rotation.z = Math.PI * 0.5
        break
      case '-z':
        this.directionMesh.position.x = 0
        this.directionMesh.position.z = -4.7
        this.directionMesh.rotation.z = Math.PI * 0.5
        break
      default:
        return
    }
  }

  getRandomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  onDirectionChange(listener: Function) {
    listener(this.direction)
    this.onDirectionChangeListeners.push(listener)
  }

  render() {
    return this.directionMesh
  }
}
