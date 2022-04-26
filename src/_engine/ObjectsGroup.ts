import * as THREE from 'three'

export class ObjectsGroup extends THREE.Group {
  public readonly name: string

  private objects: THREE.Object3D[]

  constructor(name: string, ...object: THREE.Object3D[]) {
    super()
    this.name = name
    this.objects = object || []
    super.add.apply(this, object)
  }

  public add(...object: THREE.Object3D[]) {
    this.objects.push.apply(this.objects, object)
    super.add.apply(this, object)

    return this
  }
}