import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import GameElement from '../engine/GameElement'
import DefaultPhysicsElement from '../engine/DefaultPhysicsElement';

export default class Grave extends GameElement {
  
  mesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(
      new THREE.Shape()
        .moveTo(0, 0)
        .lineTo(0, 0.35)
        .bezierCurveTo(0.03, 0.45, 0.03, 0.45, 0.03, 0.35)
        .lineTo(0.03, 0)
        .lineTo(0, 0), 
      {
        steps: 1,
        depth: 0.22,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.07,
        bevelOffset: 0,
        bevelSegments: 3
      }),
    new THREE.MeshStandardMaterial({ color: 0x525556 })
  )

  grave = new DefaultPhysicsElement(this.mesh, {mass: 1})

  state = {
    soil: null as THREE.Object3D
  }

  constructor() {
    super()
    this.setCastShadow(true)
    this.setReceiveShadow(true)

    this.grave.position.x = -0.7
    this.grave.position.z = 0.125
    this.grave.position.y = 0.08
    this.grave.rotation.x = Math.PI * 0.02
    this.grave.rotation.y = Math.PI

    const loader = new GLTFLoader();
    loader.load('/soil.gltf', ({ scene: model }) => {
      const soil = model.getObjectByName('Cube001');
      (soil as any).material = new THREE.MeshStandardMaterial({ color: 0x602212 });
      soil.castShadow = true
      soil.receiveShadow = true
      this.state.soil = soil
    });
  }

  render() {
    return [
      this.grave,
      this.state.soil
    ]
  }
}