/**
 * Interpolates the pos and rot of this.el to smoothly follow the home entity
 */
export const SmoothFollow = {
  schema: {
    homeId: { type: 'selector', default: '#followerHome' },
    posSpeed: { type: 'number', default: 0.1 },
    rotSpeed: { type: 'number', default: 0.1 }
  },
  init () {
    this.targetPos = new THREE.Vector3()
    this.targetRot = new THREE.Quaternion()
  },
  update () {
    this.home = this.data.homeId.object3D
    this.follower = this.el.object3D
  },
  tick () {
    // Lerp position
    this.home.getWorldPosition(this.targetPos)
    this.follower.position.lerp(this.targetPos, this.data.posSpeed)
    // Slerp rotation
    this.home.getWorldQuaternion(this.targetRot)
    this.follower.quaternion.slerp(this.targetRot, this.data.rotSpeed)
  }
}
