// This component applies an X and Y offset to the base color texture map for an already-UV'ed gltf
export const UVOffset = {
  schema: {
    offsetX: { default: 0 },
    offsetY: { default: 0 }
  },
  init () {
    this.model = null
    this.mixer = null
    this.offset = new THREE.Vector2(this.data.offsetX, this.data.offsetY)
    this.hasLoaded = false

    const model = this.el.getObject3D('mesh')

    if (model) {
      this.load(model)
    } else {
      this.el.addEventListener(
        'model-loaded',
        (e) => {
          this.load(e.detail.model)
        }
      )
    }
  },

  load (model) {
    // const scene = this.el.sceneEl
    this.model = model
    this.hasLoaded = true

    this.model.traverse((node) => {
      if (node.isMesh) {
        node.material.map.offset = this.offset
        node.material.needsUpdate = true
      }
    })
  },

  update () {
    if (!this.hasLoaded) return
    this.offset = new THREE.Vector2(this.data.offsetX, this.data.offsetY)
    this.model.traverse((node) => {
      if (node.isMesh) {
        node.material.map.offset = this.offset
        node.material.needsUpdate = true
      }
    })
  }
}
