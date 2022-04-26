import Engine from "./engine/Engine";
import * as THREE from 'three'
import Tree from "./Tree";
import DefaultPerspectiveCamera from "./engine/DefaultPerspectiveCamera";


const canvas = document.querySelector('canvas.webgl')

new Engine(canvas, Tree)
    .setCamera(new DefaultPerspectiveCamera())
    .start()