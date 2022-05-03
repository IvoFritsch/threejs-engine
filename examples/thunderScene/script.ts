import Engine from '../../src/engine/Engine'
import DefaultOrbitCamera from '../../src/engine/cameras/DefaultOrbitCamera'
import ThunderScene from './ThunderScene'
import '../../src/style.css'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

const engine = new Engine(canvas, ThunderScene).enableStats()

engine.setCamera(new DefaultOrbitCamera(engine, { position: { x: 2, y: 2, z: 0} }))

engine.start()
