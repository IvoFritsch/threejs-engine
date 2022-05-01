
import * as THREE from 'three'

/**
 * Rotate a mesh around a point in the world
 * @param {CANNON.Body} mesh The mesh to rotate
 * @param {THREE.Material} point The point in the world
 * @param {THREE.Group} axis The axis wich to rotate
 * @param {{ angle: number, distance: number}} amount the angle or the distance to rotate around that point
 * 
 */
export function rotateAroundWorldPoint( 
  mesh: THREE.Object3D, 
  point: THREE.Vector3, 
  axis: THREE.Vector3, 
  { angle, distance }: { angle?: number, distance?: number} ) {
  if( angle == 0 || distance == 0) return
  if(distance) {
    angle = distance / mesh.position.distanceTo(point)
  }

  const q = new THREE.Quaternion()
  q.setFromAxisAngle( axis, angle );

  mesh.applyQuaternion( q );

  mesh.position.sub( point );
  mesh.position.applyQuaternion( q );
  mesh.position.add( point );
}