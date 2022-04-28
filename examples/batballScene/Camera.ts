import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import DefaultPerspectiveCamera from '../../src/engine/DefaultPerspectiveCamera'
import GlobalEngineContext from '../../src/engine/GlobalEngineContext'

export default class Camera extends DefaultPerspectiveCamera {
  controls = new OrbitControls(this, GlobalEngineContext.engine.info.target)

  constructor() {
    super()
    this.castShadow = true
    this.position.set(0, 10, 0)
  }

  tick() {
    this.controls.update()
  }
}
