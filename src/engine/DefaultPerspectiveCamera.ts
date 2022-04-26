import * as THREE from 'three'
import GlobalEngineContext from './GlobalEngineContext'

export default class DefaultPerspectiveCamera extends THREE.PerspectiveCamera {

  constructor() {
    const engine = GlobalEngineContext.engine
    
    super(75, engine.info.sizes.width / engine.info.sizes.height, 0.1, 100)
  }

}