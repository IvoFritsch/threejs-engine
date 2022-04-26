import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DefaultPerspectiveCamera from "../engine/DefaultPerspectiveCamera";
import GlobalEngineContext from "../engine/GlobalEngineContext";

export default class GameCamera extends DefaultPerspectiveCamera {

  controls = new OrbitControls( this, GlobalEngineContext.engine.info.target );

  constructor() {
    super()
    this.castShadow = true
    this.position.set( 0, 1, 3 );
  }

  tick() {
    this.controls.update()
  }
}