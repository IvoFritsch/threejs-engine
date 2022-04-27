import Engine from "./engine/Engine";
import ThunderScene from "../examples/thunderScene/ThunderScene";
import GameCamera from "../examples/thunderScene/GameCamera";
import './style.css'

const canvas = document.querySelector('canvas.webgl')

new Engine(canvas, ThunderScene)
    .activePhysics()
    .setCamera(new GameCamera())
    .start()