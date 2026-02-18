export const MaterialOverride = {
  schema: {
    imageIDs: { type: 'array' }, // The ID of the a-asset to use
    nodeNames: { type: 'array' }, // Omit this param to affect the entire mesh
    transparency: { type: 'boolean', default: false }
  },
  init () {},
  update () {
    const model = this.el.getObject3D('mesh')

    if (model) {
      this.override(model)
    } else {
      this.el.addEventListener(
        'model-loaded',
        (e) => {
          this.override(e.detail.model)
        }
      )
    }
  },

  override (model) {
    // const scene = this.el.sceneEl
    const { imageIDs, nodeNames, transparency } = this.data
    imageIDs.forEach((id, idx) => {
      const src = document.getElementById(id).src
      console.log('material-override image src:', src)
      const texture = new THREE.TextureLoader().load(src)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.flipY = false
      texture.format = THREE.RGBFormat
      texture.encoding = THREE.sRGBEncoding

      // Create an unlit material
      const overMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: transparency,
        skinning: true,
        side: THREE.DoubleSide
      })

      model.traverse((node) => {
        if (!node.isMesh) return
        // console.log(node.name)
        // Color the whole model
        if (!nodeNames.length) {
          node.material = overMat
          node.material.needsUpdate = true
        // Target specific nodes, if given
        } else if (nodeNames[idx].includes(node.name)) {
          // console.log(node.name)
          node.material = overMat
          node.material.needsUpdate = true
        }
      })
    })
  }
}
