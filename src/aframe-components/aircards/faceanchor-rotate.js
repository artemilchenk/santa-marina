export const FaceanchorRotate = {
  schema: {
    axis: { type: 'array' } // include lowercase letters for each axis that should rotate e.g: 'x, y, z'
  },
  init () {
    let id_ = null
    this.el.object3D.visible = false
    const { axis } = this.data
    const show = ({ detail }) => {
      if (id_ && detail.id !== id_) {
        return
      }
      id_ = detail.id
      const { position, rotation, scale } = detail.transform
      console.log(rotation)
      this.el.object3D.position.copy(position)
      this.el.object3D.setRotationFromQuaternion(rotation)
      if (!axis.includes('x')) {
        this.el.object3D.rotation.x = 0
      } else {
        this.el.object3D.rotation.x = -this.el.object3D.rotation.x // possible this may not need to be inverted depending on scenario
      }
      if (!axis.includes('y')) {
        this.el.object3D.rotation.y = 0
      } else {
        this.el.object3D.rotation.y = -this.el.object3D.rotation.y // possible this may not need to be inverted depending on scenario
      }
      if (!axis.includes('z')) {
        this.el.object3D.rotation.z = 0
      } else {
        this.el.object3D.rotation.z = -this.el.object3D.rotation.z // possible this may not need to be inverted depending on scenario
      }
      this.el.object3D.scale.set(scale, scale, scale)
      this.el.object3D.visible = true
    }

    const hide = ({ detail }) => {
      this.el.object3D.visible = false
      id_ = null
    }

    this.el.sceneEl.addEventListener('xrfacefound', show)
    this.el.sceneEl.addEventListener('xrfaceupdated', show)
    this.el.sceneEl.addEventListener('xrfacelost', hide)
    window.addEventListener('mediarecorder-previewopened', (event) => {
      window.dataLayer.push({ event: 'Selfie' })
    })
  }
}
