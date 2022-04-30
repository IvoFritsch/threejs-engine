import Engine from "./engine/Engine";
import ThunderScene from "../examples/thunderScene/ThunderScene";
import './style.css'
import Base from "../examples/testePit/Base";
import DefaultOrbitCamera from "./engine/DefaultOrbitCamera";
import Quarto from "../examples/testePit/Quarto";

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

const engine = new Engine(canvas, Base)
    //.enablePhysics({ gravity: [0, -1, 0] })
    .enableStats()

  new Quarto()
engine.setCamera(new DefaultOrbitCamera(engine))

engine.start()
    