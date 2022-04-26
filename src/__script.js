import Engine from "./engine/Engine";
import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')
const engine = new Engine(canvas)

engine.onConfigureScene(scene => {
  const cube = new THREE.Mesh( 
    new THREE.BoxGeometry( 1, 1, 1 ), 
    new THREE.MeshStandardMaterial( { color: 0x00ff00 } ) 
  );
  engine.add('cubes', cube);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)
  
  const sun = new THREE.DirectionalLight()
  sun.position.set(4, 5, -2)
  scene.add(sun)

})

engine.onTick(({ camera }) => {
  camera.position.z += 0.01
  const cubes = engine.getGroup('cubes')
  cubes.rotation.x += 0.01
  cubes.rotation.y += 0.01
})

engine.start()