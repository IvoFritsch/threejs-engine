import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui'

/**
 * GUI
 */
const gui = new GUI()
gui.hide()
if (window.location.hash === '#debug') gui.show()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Fog
 */
const fog = new THREE.Fog(0x000000, 0.1, 6)
gui.addColor(fog, 'color').name('Fog')
scene.fog = fog

/**
 * Object
 */

// Load blender objects

const loader = new GLTFLoader();

loader.load('/soil.gltf', ({ scene: model }) => {
    const soil = model.getObjectByName('Cube001')
    soil.material = new THREE.MeshStandardMaterial({ color: 0x602212 });
    soil.castShadow = true
    soil.receiveShadow = true
    gui.addColor(soil.material, 'color').name('Soil')
    scene.add(soil);
});

// Grave
const graveShape = new THREE.Shape();
graveShape.moveTo(0, 0);
graveShape.lineTo(0, 0.35);
graveShape.bezierCurveTo(0.03, 0.45, 0.03, 0.45, 0.03, 0.35)
graveShape.lineTo(0.03, 0);
graveShape.lineTo(0, 0);

const graveExtrudeSettings = {
    steps: 1,
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.07,
    bevelOffset: 0,
    bevelSegments: 3
};

const grave = new THREE.Mesh(
    new THREE.ExtrudeGeometry(graveShape, graveExtrudeSettings),
    new THREE.MeshStandardMaterial({ color: 0x525556 })
);
grave.castShadow = true
grave.receiveShadow = true
grave.position.x = -0.7
grave.position.z = 0.125
grave.position.y = 0.08
grave.rotation.x = Math.PI * 0.02
grave.rotation.y = Math.PI
gui.addColor(grave.material, 'color').name('Grave')
scene.add(grave);

// Trees
const tree = new THREE.Group()
const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.43, 8);
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0xae6b47 });
trunkGeometry.translate(0, trunkGeometry.parameters.height / 2, 0)

const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
trunk.castShadow = true

const leavesGeometry = new THREE.CapsuleBufferGeometry(0.5, 0.5, 2, 5);
const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x607141 });
leavesGeometry.translate(0, leavesGeometry.parameters.height / 2, 0)

const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
leaves.castShadow = true
leaves.position.y = 0.9

gui.addColor(trunkMaterial, 'color').name('Trunk tree')
gui.addColor(leavesMaterial, 'color').name('Leaves tree')

tree.add(leaves, trunk)

const treePositions = [
    [-1.2, 2.3], [-0.6, 1], [0.5, 1.6], [1.3, 2.1], [1.22, 1.1],
    [-1, -1], [0.2, -0.75], [1.1, -0.8], [0.5, -1.8], [-0.5, -1.9]
]

for (const tp of treePositions) {
    const treeClone = tree.clone()
    treeClone.position.x = tp[0]
    treeClone.position.z = tp[1]
    const scale = Math.random() * (0.8 - 0.55) + 0.55;
    treeClone.scale.set(scale, scale, scale)
    scene.add(treeClone)
}

// Floor
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(3, 5),
    new THREE.MeshStandardMaterial({ color: 0x4e6a1b })
)
plane.receiveShadow = true
plane.rotation.x = -Math.PI * 0.5
gui.addColor(plane.material, 'color').name('Grass')
scene.add(plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.3)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.3)
moonLight.position.set(4, 5, - 2)
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.near = 4
moonLight.shadow.camera.far = 9

const moonLightCameraHelper = new THREE.CameraHelper(moonLight.shadow.camera)
moonLightCameraHelper.visible = false

gui.add(moonLightCameraHelper, 'visible').name('Moon Light Camera Helper')
scene.add(moonLight, moonLightCameraHelper)

const thunder = new THREE.PointLight(0x4d88ff, 25, 20)
const thunderHelper = new THREE.PointLightHelper(thunder)
thunder.shadow.mapSize.width = 1024 * 2
thunder.shadow.mapSize.height = 1024 * 2
thunder.shadow.camera.near = 3
thunder.shadow.camera.far = 5

thunderHelper.visible = false
thunder.position.y = 5
thunder.visible = false
moonLight.castShadow = true

const thunderCameraHelper = new THREE.CameraHelper(thunder.shadow.camera)
thunderCameraHelper.visible = false

gui.add(thunderCameraHelper, 'visible').name('Thunder Light Camera Helper')
gui.addColor(thunder, 'color').name('Thunder')
gui.add(thunderHelper, 'visible').name('Thunder Helper')
scene.add(thunder, thunderHelper, thunderCameraHelper)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2
camera.position.y = 2.5
camera.position.z = 0
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadow
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
moonLight.castShadow = true
thunder.castShadow = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Thunder rotation
    thunder.position.x = Math.sin(elapsedTime * 5) * 5
    thunder.position.z = Math.cos(elapsedTime * 5) * 5
    if (Math.random() < 0.015) {
        thunder.visible = true
        thunder.intensity = Math.random() * (200 - 5) + 5
        setTimeout(() => {
            thunder.visible = false
        }, Math.random() * (30 - 10) + 10)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()