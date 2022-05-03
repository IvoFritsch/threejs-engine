import DefaultPerspectiveCamera from '../../src/engine/cameras/DefaultPerspectiveCamera'
import Engine from '../../src/engine/Engine'
import BatballScene from './BatballScene'
import '../../src/style.css'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

const engine = new Engine(canvas, BatballScene)
  .enablePhysics({ gravity: [0, -9.82, 0] })
  .enableWebxr()
  .enableStats()

engine.setCamera(new DefaultPerspectiveCamera(engine))

engine.start()
