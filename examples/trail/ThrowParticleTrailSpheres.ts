import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import GameElement from '../../src/engine/elements/GameElement'

interface Particle {
  particle: THREE.Points
  frame: number
}

export default class ThrowParticleTrailSpheres extends GameElement {
  spheres: DefaultPhysicsElement[] = []
  sphereGeometry = new THREE.SphereBufferGeometry(0.3)
  sphereMaterial = new THREE.MeshToonMaterial({ color: 0x333333 })

  particle: THREE.Points
  particles: Particle[] = []

  textureLoader = new THREE.TextureLoader()
  circleTexture = this.textureLoader.load('/textures/sprites/circle.png')

  constructor() {
    super()
    this.createDefaultParticle()
  }

  onEnterScene() {
    // this.throwSphere()
  }

  createDefaultParticle() {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([0, 0, 0])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

    this.particle = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 1,
        sizeAttenuation: true,
        transparent: true,
        map: this.circleTexture,
        opacity: 0.05,
        visible: true,
      })
    )
  }

  throwSphere() {
    const sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial)
    sphereMesh.position.set(6, 3, 6)

    const sphere = new DefaultPhysicsElement(sphereMesh, { mass: 1 })
    sphere.getMesh().castShadow = true
    sphere
      .getBody()
      .applyLocalImpulse(new CANNON.Vec3(-10, 3, -10), new CANNON.Vec3(0, 0, 0))

    this.spheres.push(sphere)
    this.requestRender()
  }

  tick() {
    this.createParticles()
    this.updateParticles()
    if (this.particles.length) this.requestRender()
  }

  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i]

      particle.frame++

      if (particle.frame >= 30) {
        this.particles.splice(i, 1)
      }
    }
  }

  createParticles() {
    for (const sphere of this.spheres) {
      const velocity = sphere.getBody().velocity.clone().normalize()
      if (velocity < 3) continue

      const particle = this.particle.clone()
      particle.position.copy(sphere.position)

      this.particles.push({
        particle,
        frame: 0,
      })
    }
  }

  render() {
    const particles = this.particles.map(({ particle }) => particle)
    return [this.spheres, particles]
  }
}
