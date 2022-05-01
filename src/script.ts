import Engine from './engine/Engine'
import './style.css'
import BatballScene from '../examples/batballScene/BatballScene'
import DefaultPerspectiveCamera from './engine/DefaultPerspectiveCamera'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

const engine = new Engine(canvas, BatballScene)
  .enablePhysics({ gravity: [0, -9.82, 0] })
  .enableWebxr()
  .enableStats()

engine.setCamera(new DefaultPerspectiveCamera(engine))

engine.start()
