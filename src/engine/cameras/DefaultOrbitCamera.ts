import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DefaultPerspectiveCamera from "./DefaultPerspectiveCamera";
import Engine from "../Engine";

export default class DefaultOrbitCamera extends DefaultPerspectiveCamera {

  controls: OrbitControls

  constructor(engine: Engine, { position = { x:5, y:2, z: 5 } } = {}) {
    super(engine)
    this.controls = new OrbitControls( this, engine.info.target );
    this.position.set( position.x, position.y, position.z );
  }

  tick() {
    this.controls.update()
  }
}