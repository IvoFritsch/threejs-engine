import Engine from './engine/Engine'
import DefaultOrbitCamera from './engine/cameras/DefaultOrbitCamera'
import './style.css'
import Base from '../examples/testePit/Base'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

const engine = new Engine(canvas, Base)
  .enablePhysics({ gravity: [0, -9.82, 0] })
  .enableStats()

engine.setCamera(new DefaultOrbitCamera(engine))

engine.start()
