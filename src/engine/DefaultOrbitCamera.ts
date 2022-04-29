import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DefaultPerspectiveCamera from "./DefaultPerspectiveCamera";
import GlobalEngineContext from "./GlobalEngineContext";

export default class DefaultOrbitCamera extends DefaultPerspectiveCamera {

  controls = new OrbitControls( this, GlobalEngineContext.engine.info.target );

  constructor() {
    super()
    this.position.set( 5, 2, 5 );
  }

  tick() {
    this.controls.update()
  }
}