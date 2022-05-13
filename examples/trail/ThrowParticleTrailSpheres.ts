import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import DefaultPhysicsElement from '../../src/engine/elements/DefaultPhysicsElement'
import GameElement from '../../src/engine/elements/GameElement'

interface Particle {
  particle: THREE.Points
  frame: number
}

export default class ThrowParticleTrailSpheres extends GameElement {
  debug = {
    particles: 30,
    force: 20,
  }
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
    const gui = this.engine.getGui()
    gui.add(this.debug, 'particles').min(0).max(100).step(1).name('Número de particulas')
    gui
      .add(this.debug, 'force')
      .min(0)
      .max(100)
      .step(1)
      .name('Força da esfera com particulas')
    gui.add(this, 'throwSphere').name('Jogar esfera com particulas')
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

      if (particle.frame >= this.debug.particles) {
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
