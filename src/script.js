import Engine from "./engine/Engine";
import DefaultPerspectiveCamera from "./engine/DefaultPerspectiveCamera";
import ThunderScene from "./game/ThunderScene";
import GameCamera from "./game/GameCamera";

const canvas = document.querySelector('canvas.webgl')

new Engine(canvas, ThunderScene)
    .setCamera(new GameCamera())
    .start()