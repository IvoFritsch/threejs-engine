import GameElement from "../elements/GameElement"
import { KeyCode } from "./KeyCode"

export function WhileDown(keyboardKey: KeyCode) {

  return (target: GameElement, key: string, descriptor: PropertyDescriptor) => {
    GameElement
      .registerWhileKeySubclassFunction(
        target.constructor as typeof GameElement, 
        keyboardKey, 
        key,
        'whileDown'
    )
    //target.registerTickListener(descriptor.value)
    return descriptor
  }
}

export function WhileUp(keyboardKey: KeyCode) {
  return (target: GameElement, key: string, descriptor: PropertyDescriptor) => {
    GameElement
      .registerWhileKeySubclassFunction(
        target.constructor as typeof GameElement, 
        keyboardKey, 
        key,
        'whileUp'
    )
    //target.registerTickListener(descriptor.value)
    return descriptor
  }
}