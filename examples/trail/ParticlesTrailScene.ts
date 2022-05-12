import * as THREE from 'three'
import GameElement from '../../src/engine/elements/GameElement'
import Lights from './Lights'
import Sphere from './Sphere'

interface Particle extends THREE.Points {
  frame?: number
}

export default class ParticlesTrailScene extends GameElement {
  sphere = new Sphere()
  lights = new Lights()

  particle: THREE.Points
  particles: Particle[] = []

  textureLoader = new THREE.TextureLoader()
  circleTexture = this.textureLoader.load('/textures/sprites/circle.png')

  constructor() {
    super()
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

  tick() {
    this.updateParticles()
    this.createParticle()
    this.requestRender()
  }

  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]

      p.frame++

      if (p.frame >= 30) {
        this.particles.splice(i, 1)
      }
    }
  }

  createParticle() {
    const particle = this.particle.clone() as Particle
    particle.frame = 0
    particle.position.copy(this.sphere.sphere.position)
    this.particles.push(particle)
  }

  render() {
    return [this.sphere, this.lights, this.particles]
  }
}
