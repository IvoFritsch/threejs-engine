import Engine from "./engine/Engine";
import ThunderScene from "./game/ThunderScene";
import GameCamera from "./game/GameCamera";
import './style.css'

const canvas = document.querySelector('canvas.webgl')

new Engine(canvas, ThunderScene)
    .activePhysics()
    .setCamera(new GameCamera())
    .start()