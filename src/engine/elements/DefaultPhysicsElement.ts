import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import GameElement from './GameElement'
import { threeToCannon } from 'three-to-cannon'
import { bodyToMesh } from '../utils/bodyToMesh'
import LoadedElement, { OnLoadFunction } from './LoadedElement'

interface BodyOptions extends CANNON.BodyOptions {
  positionOffset?: CANNON.Vec3
  quaternionOffset?: CANNON.Quaternion
}

interface DefaultPhysicsElementOptions {
  renderMesh?: boolean
  wireframe?: boolean
  updatePosition?: boolean
  updateRotation?: boolean
  updateDirection?: 'bodyToMesh' | 'meshToBody'
  afterLoad?: OnLoadFunction
}

const defaultOptions: DefaultPhysicsElementOptions = {
  updateDirection: 'bodyToMesh',
  updatePosition: true,
  updateRotation: true,
  renderMesh: true,
}

export default class DefaultPhysicsElement extends GameElement {
  private mesh: THREE.Object3D
  private body: CANNON.Body
  private meshWireframe: THREE.Object3D
  private options: DefaultPhysicsElementOptions

  position = new THREE.Vector3()
  rotation = new THREE.Euler()

  constructor(
    mesh: THREE.Object3D | LoadedElement,
    bodyOptions: BodyOptions = {},
    options: DefaultPhysicsElementOptions = {}
  ) {
    super()
    if (mesh instanceof THREE.Object3D) {
      this.mesh = mesh
      this.continueConstruction(bodyOptions, options)
    }
  }

  private continueConstruction(
    bodyOptions: BodyOptions = {},
    options: DefaultPhysicsElementOptions = {}
  ) {
    this.options = { ...defaultOptions, ...options }
    this.handleBody(bodyOptions)

    this.setPosition(this.mesh, this.body)
    this.setQuaternion(this.mesh, this.body)

    this.position = this.positionProxy()
    this.rotation = this.quaternionProxy()
  }

  onEnterScene() {
    const world = this.engine.getPhysicsWorld()
    if (world) world.addBody(this.body)
  }

  onExitScene() {
    const world = this.engine.getPhysicsWorld()
    if (world) world.removeBody(this.body)
  }

  tick() {
    this.updateElements()
    this.updateWireframe()
  }

  private updateElements() {
    const { from, to } = this.getUpdateDirectionElements()
    if (this.options.updatePosition) this.setPosition(from, to)
    if (this.options.updateRotation) this.setQuaternion(from, to)
  }

  private updateWireframe() {
    if (!this.meshWireframe) return
    this.setPosition(this.body, this.meshWireframe)
    this.setQuaternion(this.body, this.meshWireframe)
  }

  private getUpdateDirectionElements() {
    if (this.options.updateDirection === 'bodyToMesh')
      return { from: this.body, to: this.mesh }
    return { from: this.mesh, to: this.body }
  }

  getMesh() {
    return this.mesh
  }

  getBody() {
    return this.body
  }

  render() {
    return [this.options.renderMesh && this.mesh, this.meshWireframe]
  }

  private handleBody({ shape, positionOffset, quaternionOffset, ...bodyOptions }: any) {
    this.body = new CANNON.Body(bodyOptions)

    if (shape) {
      this.body.addShape(shape, positionOffset, quaternionOffset)
    } else {
      const result = threeToCannon(this.mesh as any)
      this.body.addShape(result.shape, result.offset, result.orientation)
    }

    if (this.options.wireframe) {
      this.meshWireframe = bodyToMesh(
        this.body,
        new THREE.MeshBasicMaterial({ wireframe: true })
      )
    }
  }

  private setPosition(
    from: THREE.Object3D | CANNON.Body,
    to: THREE.Object3D | CANNON.Body
  ) {
    to.position.set(from.position.x, from.position.y, from.position.z)
  }

  private setQuaternion(
    from: THREE.Object3D | CANNON.Body,
    to: THREE.Object3D | CANNON.Body
  ) {
    to.quaternion.set(
      from.quaternion.x,
      from.quaternion.y,
      from.quaternion.z,
      from.quaternion.w
    )
  }

  private positionProxy() {
    return new Proxy(this.mesh.position, {
      set: (target, key: 'x' | 'y' | 'z', value) => {
        target[key] = value
        this.setPosition(this.mesh, this.body)
        return true
      },
      get: (target, key: 'x' | 'y' | 'z') => {
        if (!['x', 'y', 'z'].includes(key))
          throw new Error('Somente é possível acessar as propriedades X, Y, Z.')
        return target[key]
      },
    })
  }

  private quaternionProxy() {
    return new Proxy(this.mesh.rotation, {
      set: (target, key: 'x' | 'y' | 'z', value) => {
        target[key] = value
        this.setQuaternion(this.mesh, this.body)
        return true
      },
      get: (target, key: 'x' | 'y' | 'z') => {
        if (!['x', 'y', 'z'].includes(key))
          throw new Error('Somente é possível acessar as propriedades X, Y, Z.')
        return target[key]
      },
    })
  }
}
