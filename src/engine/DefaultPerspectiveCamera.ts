import * as THREE from 'three'
import Engine from './Engine'

export default class DefaultPerspectiveCamera extends THREE.PerspectiveCamera {

  constructor(engine: Engine) {
    
    super(75, engine.info.sizes.width / engine.info.sizes.height, 0.1, 100)
  }

}