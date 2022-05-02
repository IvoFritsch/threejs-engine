import Engine from './engine/Engine'
import DefaultOrbitCamera from './engine/cameras/DefaultOrbitCamera'
import Base from '../examples/carrinho/Base'
import CrossyRoad from '../examples/crossyRoad'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

const engine = new Engine(canvas, Base)
  //.enablePhysics({ gravity: [0, -9.82, 0] })
  //.enableWebxr()
  .enableStats()

engine.setCamera(new DefaultOrbitCamera(engine))

engine.start()
