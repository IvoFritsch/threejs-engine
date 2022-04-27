import Engine from "./engine/Engine";
import ThunderScene from "./game/ThunderScene";
import GameCamera from "./game/GameCamera";
import './style.css'

const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')

new Engine(canvas, ThunderScene)
    .activePhysics()
    .activeStats()
    .setCamera(new GameCamera())
    .start()
    