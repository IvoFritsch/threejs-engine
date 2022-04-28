import Engine from './engine/Engine'
import BatballScene from '../examples/batballScene/BatballScene'
import Camera from '../examples/batballScene/Camera'
import './style.css'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

new Engine(canvas, BatballScene)
  .activePhysics({ gravity: [0, -9.82, 0] })
  .activeStats()
  .setCamera(new Camera())
  .start()
