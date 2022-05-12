import DefaultOrbitCamera from '../../src/engine/cameras/DefaultOrbitCamera'
import Engine from '../../src/engine/Engine'
import ParticlesTrailScene from './ParticlesTrailScene'
import ConeTrailScene from './ConeTrailScene'
import PhysicsTrailScene from './PhysicsTrailScene'
import '../../src/style.css'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

const engine = new Engine(canvas, PhysicsTrailScene)
  .enablePhysics({ gravity: [0, -9.82, 0] })
  .enableStats()

engine.setCamera(new DefaultOrbitCamera(engine))

engine.start()
