export const SwitchDof = {
  schema: {
    disableWorldTracking: { type: 'bool', default: true },
    requestGyro: { type: 'bool', default: true }
  },
  init () {
    const scene = this.el.sceneEl
    const { requestGyro, disableWorldTracking } = this.data

    // Switch from 6DOF to 3DOF
    const addXRWeb = () => {
      if (requestGyro === true && disableWorldTracking === true) {
        // If world tracking is disabled, and you still want gyro enabled (i.e. 3DoF mode)
        // Request motion and orientation sensor via XR8's permission API
        XR8.addCameraPipelineModule({
          name: 'request-gyro',
          requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION])
        })
      }
      scene.setAttribute('xrweb', `disableWorldTracking: ${disableWorldTracking}`)
    }

    addXRWeb()
  }
}
