import GameElement from "../../src/engine/elements/GameElement";
import * as THREE from 'three'
import { MathUtils, Object3D, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import DefaultGLTFElement from "../../src/engine/elements/DefaultGLTFElement";
import { WhileDown, WhileUp } from "../../src/engine/controls/WhileKey";
import { rotateAroundWorldPoint } from "../../src/engine/utils/rotation";
import DefaultOrbitCamera from "../../src/engine/cameras/DefaultOrbitCamera";

export default class Veiculo extends GameElement {

  positionX: number
  positionZ: number

  comprimentoVeiculo = 1

  veiculo = new DefaultGLTFElement('/sedan.glb', ({ model, helpers: { traverseMaterials } }) => {
    traverseMaterials((m: THREE.MeshStandardMaterial) => m.metalness = 0)
    model.position
      .setX(this.positionX)
      .setZ(this.positionZ)
    this.comprimentoVeiculo = 
        model.getObjectByName('wheel_backLeft').position.z - model.getObjectByName('wheel_frontLeft').position.z

    const pontoCurva = new THREE.Mesh().translateZ(model.getObjectByName('wheel_backLeft').position.z)
    pontoCurva.name = 'pontoCurva'
    model.rotateY(MathUtils.degToRad(-30))
    model.add(pontoCurva)
    return model
  })

  speed = 0

  constructor(positionX: number, positionZ: number) {
    super()
    this.positionX = positionX
    this.positionZ = positionZ
    //this.pontoCurva.position.copy(this.turningAroundPoint)
  }
  
  topSpeed = 0.04
  topSpeedBackwards = -0.02

  @WhileDown('w') front() {
    if(!this.veiculo.isLoaded) return
    this.speed += 0.001
    if(this.speed > this.topSpeed) this.speed = this.topSpeed
  }

  @WhileUp('w') stopFront() {
    if(!this.veiculo.isLoaded) return
    if(this.speed > 0) {
      this.speed -= 0.0002
      if(this.speed < 0) this.speed = 0
    }
  }

  @WhileDown('s') backwards() {
    if(!this.veiculo.isLoaded) return
    this.speed -= 0.001
    if(this.speed < this.topSpeedBackwards) this.speed = this.topSpeedBackwards
  }

  @WhileUp('s') stopBackwards() {
    if(!this.veiculo.isLoaded) return
    if(this.speed < 0) {
      this.speed += 0.0002
      if(this.speed > 0) this.speed = 0
    }
  }

  turnAngle = 0
  turningAroundPoint = new Vector3(0,0,0)

  @WhileDown('a') turnLeft() {
    this.turnAngle += 0.013
    if(this.turnAngle > 0.45) this.turnAngle = 0.45
    this.computeTurningAroundPoint()
  }
  
  @WhileDown('d') turnRight() {
    this.turnAngle -= 0.013
    if(this.turnAngle < -0.45) this.turnAngle = -0.45
    this.computeTurningAroundPoint()
  }

  computeTurningAroundPoint() {
    if(this.turnAngle < 0.001 && this.turnAngle > -0.001) this.turnAngle = 0
    this.turningAroundPoint.x = this.comprimentoVeiculo / Math.tan(-this.turnAngle)
    //this.turningAroundPoint.
    this.veiculo.get().getObjectByName('pontoCurva').position.x = this.comprimentoVeiculo / Math.tan(-this.turnAngle)
    //this.turningAroundPoint.x = this.veiculo.getMesh().getObjectByName('wheel_frontLeft').get
    //this.pontoCurva.position.copy(this.turningAroundPoint)
  }

  tick() {
    if(this.veiculo.isLoaded) {
      const oldCarPosition = this.veiculo.get().position.clone()
      if(this.turnAngle) {
        rotateAroundWorldPoint(
          this.veiculo.get(), 
          this.veiculo.get().getObjectByName('pontoCurva').getWorldPosition(new THREE.Vector3()), 
          new THREE.Vector3(0, 1, 0), 
          { distance: this.turnAngle > 0 ? this.speed : -this.speed}
        )
      } else {
        this.veiculo.get().translateZ(-this.speed)
      }
      if(this.speed > 0 && this.turnAngle) {
        this.turnAngle -= this.turnAngle / 130
        this.computeTurningAroundPoint()
      }
      oldCarPosition.sub(this.veiculo.get().position)
      // this.engine.getCamera().lookAt(this.veiculo.getMesh().position);
      //this.engine.getCamera().position.sub(oldCarPosition)
      this.veiculo.get().getObjectByName('wheel_frontLeft').rotation.y = this.turnAngle
      this.veiculo.get().getObjectByName('wheel_frontRight').rotation.y = this.turnAngle
    }
  }

  render() {
    return [
      this.veiculo
    ]
  }
}