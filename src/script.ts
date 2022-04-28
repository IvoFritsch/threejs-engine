import Engine from "./engine/Engine";
import ThunderScene from "../examples/thunderScene/ThunderScene";
import GameCamera from "../examples/thunderScene/GameCamera";
import './style.css'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

new Engine(canvas, ThunderScene)
    .enablePhysics({ gravity: [0, -1, 0] })
    .enableStats()
    .setCamera(new GameCamera())
    .start()
    