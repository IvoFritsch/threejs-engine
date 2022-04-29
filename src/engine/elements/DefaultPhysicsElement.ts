import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import GameElement from './GameElement'
import GlobalEngineContext from '../GlobalEngineContext'
import { threeToCannon } from 'three-to-cannon'
import { bodyToMesh } from '../utils/bodyToMesh'

export default class DefaultPhysicsElement extends GameElement {
  mesh: THREE.Object3D
  body: CANNON.Body
  bodyWireframe: THREE.Object3D
  updateBodyToMesh = true
  updatePosition = true
  updateRotation = true

  position = new THREE.Vector3()
  rotation = new THREE.Euler()

  constructor(mesh: THREE.Object3D, bodyOptions: any = {}) {
    super()
    this.mesh = mesh
    this.handleBody(bodyOptions)

    this.setPosition(this.mesh, this.body)
    this.setQuaternion(this.mesh, this.body)

    this.position = this.positionProxy()
    this.rotation = this.quaternionProxy()
  }

  onEnterScene() {
    const world = GlobalEngineContext.engine.getPhysicsWorld()
    if (world) world.addBody(this.body)
  }

  onExitScene() {
    const world = GlobalEngineContext.engine.getPhysicsWorld()
    if (world) world.removeBody(this.body)
  }

  tick() {
    if (this.updateBodyToMesh) {
      if (this.updatePosition) this.setPosition(this.body, this.mesh)
      if (this.updateRotation) this.setQuaternion(this.body, this.mesh)
    } else {
      if (this.updatePosition) this.setPosition(this.mesh, this.body)
      if (this.updateRotation) this.setQuaternion(this.mesh, this.body)
    }

    if (this.bodyWireframe) {
      this.setPosition(this.body, this.bodyWireframe)
      this.setQuaternion(this.body, this.bodyWireframe)
    }
  }

  bodies() {
    return this.body
  }

  render() {
    return [this.mesh, this.bodyWireframe]
  }

  private handleBody({
    wireframe,
    shape,
    positionOffset,
    quaternionOffset,
    ...bodyOptions
  }: any) {
    this.body = new CANNON.Body(bodyOptions)

    if (shape) {
      this.body.addShape(shape, positionOffset, quaternionOffset)
    } else {
      const result = threeToCannon(this.mesh as any)
      this.body.addShape(result.shape, result.offset, result.orientation)
    }

    if (wireframe) {
      this.bodyWireframe = bodyToMesh(
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
