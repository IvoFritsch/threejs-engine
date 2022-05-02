import { Object3D } from "three"
import GameElement from "./GameElement"

export interface OnLoadProps {
  model: THREE.Group,
  helpers: {
    traverseMaterials: (callback: (m: THREE.Material) => void) => void
  }
}

export type OnLoadFunction<T = Object3D> = (props: OnLoadProps) => T

export default abstract class LoadedElement<T = Object3D> extends GameElement{
  public isLoaded: boolean

  protected wrapOnLoad({model}: { model: OnLoadProps['model']}, onLoad: OnLoadFunction<T>): T {
    return onLoad({
      model,
      helpers: {
        traverseMaterials: (c) => model.traverse((o: any) => o.material && c(o.material))
      }
    })
  }

}