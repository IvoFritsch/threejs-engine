import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import GameElement from '../../src/engine/elements/GameElement'

interface Sphere {
  sphere: DefaultPhysicsElement
  cone: THREE.Mesh
}

export default class ThrowConeTrailSpheres extends GameElement {
  debug = {
    coneMultiplicator: 2,
    force: 20,
  }
  spheres: Sphere[] = []
  sphereGeometry = new THREE.SphereBufferGeometry(0.3)
  sphereMaterial = new THREE.MeshToonMaterial({ color: 0x333333 })

  cone = new THREE.Mesh(
    new THREE.ConeBufferGeometry(0.25, 0.1),
    new THREE.MeshBasicMaterial({
      opacity: 0.3,
      transparent: true,
    })
  )

  constructor() {
    super()
    this.cone.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.05, 0))
    this.cone.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
    this.cone.visible = false
  }

  onEnterScene() {
    const gui = this.engine.getGui()
    gui
      .add(this.debug, 'coneMultiplicator')
      .min(0)
      .max(4)
      .step(0.5)
      .name('Multiplicador do cone')
    gui.add(this.debug, 'force').min(0).max(100).step(1).name('Força da esfera com cone')
    gui.add(this, 'throwSphere').name('Jogar esfera com cone')
  }

  getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  throwSphere() {
    const xz = this.getRandomArbitrary(5, 8)
    const y = this.getRandomArbitrary(1, 5)

    const sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial)
    sphereMesh.position.set(xz, y, xz)

    const sphere = new DefaultPhysicsElement(sphereMesh, { mass: 1 })
    sphere.getMesh().castShadow = true
    sphere
      .getBody()
      .applyLocalImpulse(
        new CANNON.Vec3(-this.debug.force, 3, -this.debug.force),
        new CANNON.Vec3(0, 0, 0)
      )

    this.spheres.push({
      sphere,
      cone: this.cone.clone(),
    })
    this.requestRender()
  }

  tick() {
    this.updateCones()
  }

  updateCones() {
    for (const s of this.spheres) {
      const velocity = s.sphere.getBody().velocity.clone().normalize()
      const mesh = s.sphere.getMesh()
      s.cone.visible = velocity >= 1
      s.cone.scale.z = velocity * this.debug.coneMultiplicator
      s.cone.lookAt(mesh.position)
      s.cone.position.copy(mesh.position)
    }
  }

  render() {
    const spheres = this.spheres.map(({ sphere }) => sphere)
    const cones = this.spheres.map(({ cone }) => cone)

    return [spheres, cones]
  }
}
