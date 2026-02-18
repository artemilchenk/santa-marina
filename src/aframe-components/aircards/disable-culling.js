// This component disabled frustum culling at the THREE.js level.
// Simply apply it to the element you want to remain visible at all times.

// EX. USE CASE: On occasion, a model may animate some distance. As the user follows the model, the
// camera may pan beyond the root node, cause the model to disappear. `disable-culling` fixes this.

export const DisableCulling = {
  init () {
    const disableCulling = () => {
      const mesh = this.el.getObject3D('mesh')

      // If the mesh is undefined, wait for it to load and try again
      if (!mesh) {
        this.el.addEventListener('model-loaded', disableCulling, { once: true })
        return
      }

      // Once the mesh exists, disable culling for all nodes
      mesh.traverse((object) => {
        if (object.isMesh) object.frustumCulled = false
      })
    }

    // Initialize
    disableCulling()
  }
}
