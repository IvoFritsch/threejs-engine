import Engine from '../../src/engine/Engine'
import DefaultOrbitCamera from '../../src/engine/cameras/DefaultOrbitCamera'
import CrossyRodaScene from './'
import '../../src/style.css'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

const engine = new Engine(canvas, CrossyRodaScene).enableStats()

engine.setCamera(new DefaultOrbitCamera(engine))

engine.start()
