export const Colorize = {
  schema: {
    color: { type: 'string', default: '#2222ff' },
    nodeNames: { type: 'string', default: '' }, // Omit this param to occlude the entire mesh
    newMaterial: { type: 'boolean', default: false } // Use to avoid affecting other nodes
  },
  init () {},
  update () {
    const model = this.el.getObject3D('mesh')

    if (model) {
      this.colorize(model)
    } else {
      this.el.addEventListener(
        'model-loaded',
        (e) => {
          this.colorize(e.detail.model)
        }
      )
    }
  },

  // ///////////////////////////////////
  // Usage Notes:
  // - The texture (if any) is multiplied by the set color
  // - If the scene renderer param `colorManagement` is true, use `.convertSRGBToLinear()`
  // - The same material of the GLTF may be shared across multiple objects, causing all to change
  //   - Use newMaterial to avoid this
  // ///////////////////////////////////

  colorize (model) {
    const { nodeNames, newMaterial } = this.data
    let { color } = this.data
    if (color.charAt(0) !== '#') color = `#${color}` // Add a # if the color doesn't have one

    model.traverse((node) => {
      if (!node.isMesh) return

      // Color the whole model
      if (!nodeNames) {
        // The texture is multiplied by the color here, then corrected for scene colorManagement
        node.material.color.set(color).convertSRGBToLinear()
        node.material.skinning = true
        node.material.morphTargets = true
        node.material.needsUpdate = true
      }

      // Target specific nodes
      if (nodeNames.includes(node.name)) {
        // console.log(node.name, nodeNames)
        if (newMaterial) node.material = new THREE.MeshBasicMaterial()
        node.material.color.set(color).convertSRGBToLinear()
        node.material.skinning = true
        node.material.morphTargets = true
        node.material.needsUpdate = true
      }
    })
  }
}
