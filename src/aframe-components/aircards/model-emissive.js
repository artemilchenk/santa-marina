const ModelEmissive = {
  schema: { type: 'number', default: 1.0 },
  update () {
    const model = this.el.getObject3D('mesh')
    const emissiveVal = this.data
    if (model) {
      this.fade(model, emissiveVal)
    } else {
      this.el.addEventListener('model-loaded', (e) => {
        this.fade(e.detail.model, emissiveVal)
      }, { once: true })
    }
  },

  fade (model, val) {
    // const { data } = this
    if (!model) return
    model.traverse((node) => {
      if (node.isMesh) {
        console.log(Number(val))
        // if the nodes that you wish to target are of the same material, uncomment below to target each individually
        // this.clonedMaterial = node.material.clone()
        // node.material = this.clonedMaterial

        node.material.emissiveIntensity = Number(val)
        node.material.transparent = true // Previously : data < 1.0
        node.material.alphaTest = 0.25
        node.material.skinning = true
        node.material.morphTargets = true
        node.material.needsUpdate = true
      }
    })
  }
}
export { ModelEmissive }
