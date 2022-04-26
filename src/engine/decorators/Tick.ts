import GameElement from "../GameElement"

export default function Tick() {

  return (target: GameElement, key: string | symbol, descriptor: PropertyDescriptor) => {
    target.registerTickListener(descriptor.value)
    return descriptor
  }
}