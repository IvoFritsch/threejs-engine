import { KeyCode } from "./KeyCode";

export default class KeyboardKey {

  private static pressedKeys: Record<string, boolean> = {}

  static {
    document.addEventListener('keydown', (e) => {
      const key = e.key;
      KeyboardKey.pressedKeys[key] = true
    })
    document.addEventListener('keyup', (e) => {
      const key = e.key;
      KeyboardKey.pressedKeys[key] = false
    })
  }

  static isDown(key: KeyCode) {
    return !!KeyboardKey.pressedKeys[key]
  }

  static isUp(key: KeyCode) {
    return !KeyboardKey.pressedKeys[key]
  }

  private key: KeyCode

  constructor(key: KeyCode) {
    this.key = key
  }
  
  isDown() {
    return KeyboardKey.isDown(this.key)
  }

  isUp() {
    return KeyboardKey.isUp(this.key)
  }

}