export const MaterialOcclude = {
  schema: {
    nodeNames: { type: 'string', default: '' } // Omit this param to occlude the entire mesh
  },
  init () {
    this.model = null
    this.nodeNames = this.data.nodeNames
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
    this.model = model

    // Target specific nodes
    if (this.nodeNames.length > 0) {
      this.model.traverse((node) => {
        if (this.nodeNames.includes(node.name)) {
          node.material.colorWrite = false
          node.material.needsUpdate = true
        }
      })
    // Occlude the entire model
    } else {
      this.model.material.colorWrite = false
      this.model.material.needsUpdate = true
    }
  }
}
