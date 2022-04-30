import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DefaultPerspectiveCamera from "./DefaultPerspectiveCamera";
import Engine from "../Engine";

export default class DefaultOrbitCamera extends DefaultPerspectiveCamera {

  controls: OrbitControls

  constructor(engine: Engine) {
    super(engine)
    this.controls = new OrbitControls( this, engine.info.target );
    this.position.set( 5, 2, 5 );
  }

  tick() {
    this.controls.update()
  }
}