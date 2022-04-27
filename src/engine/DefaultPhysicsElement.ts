import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import GameElement from './GameElement'
import GlobalEngineContext from './GlobalEngineContext'

export default class DefaultPhysicsElement extends GameElement {
  mesh: THREE.Object3D
  body: CANNON.Body

  position = new THREE.Vector3()
  rotation = new THREE.Euler()

  constructor(mesh: THREE.Object3D, bodyOptions?: any) {
    super()
    this.mesh = mesh
    this.body = new CANNON.Body(bodyOptions)

    this.position = new Proxy(this.mesh.position, {
      set: (target, key: 'x' | 'y' | 'z', value) => {
        target[key] = value
        this.body.position.set(
          this.mesh.position.x,
          this.mesh.position.y,
          this.mesh.position.z,
        )
        return true
      }
    })

    this.rotation = new Proxy(this.mesh.rotation, {
      set: (target, key: 'x' | 'y' | 'z', value) => {
        target[key] = value
        this.body.quaternion.set(
          this.mesh.quaternion.x,
          this.mesh.quaternion.y,
          this.mesh.quaternion.z,
          this.mesh.quaternion.w,
        )
        return true
      }
    })
  }

  onEnterScene() {
    super.onEnterScene()
    const world = GlobalEngineContext.engine.getPhysics()?.getWorld()
    if(world) world.addBody(this.body)
  }

  onExitScene() {
    super.onExitScene()
    const world = GlobalEngineContext.engine.getPhysics()?.getWorld()
    if(world) world.removeBody(this.body)
  }

  tick() {
    this.mesh.position.set(this.body.position.x, this.body.position.y, this.body.position.z)
    this.mesh.quaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w)
  }

  bodies() {
    return this.body
  }

  render() {
    return this.mesh
  }
}
