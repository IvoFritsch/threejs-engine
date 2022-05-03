import Engine from '../../src/engine/Engine'
import DefaultOrbitCamera from '../../src/engine/cameras/DefaultOrbitCamera'
import Base from './Base'
import '../../src/style.css'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

const engine = new Engine(canvas, Base).enableStats()

engine.setCamera(new DefaultOrbitCamera(engine))

engine.start()
