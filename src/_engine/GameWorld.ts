
import * as THREE from 'three'
import { ObjectsGroup } from './ObjectsGroup'

export class GameWorld {

  protected scene: THREE.Scene
  protected camera: THREE.Camera
  private groups: Map<string, ObjectsGroup> = new Map()

  public add(groupName: string, ...object: THREE.Object3D[]) {
    let group = this.groups.get(groupName)
    if(group) {
      group.add.apply(group, object)
    } else {
      group = new ObjectsGroup(groupName, ...object)
      this.groups.set(groupName, group)
      this.scene.add(group)
    }
  }

  getGroup(name: string) {
    return this.groups.get(name)
  }

}