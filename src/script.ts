import Engine from './engine/Engine'
import DefaultOrbitCamera from './engine/DefaultOrbitCamera'
import './style.css'
import BatballScene from '../examples/batballScene/BatballScene'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

const engine = new Engine(canvas, BatballScene)
  .enablePhysics({ gravity: [0, -9.82, 0] })
  .enableStats()

engine.setCamera(new DefaultOrbitCamera(engine))

engine.start()
