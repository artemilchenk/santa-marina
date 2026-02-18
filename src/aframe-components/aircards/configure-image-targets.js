// Register image targets
export const ConfigureImageTargets = {
  schema: {
    targets: { type: 'array' } // Accepts a comma separated list -> "1, 2, 3" to ['1', '2', '3']
  },
  init () {
    // Proceed to update
    this.configureTargets = this.configureTargets.bind(this)
  },

  update () {
    // Configure without checking XR8 on desktop
    if (window.desktopDebug) return this.configureTargets()

    // Configure if initialized
    if (XR8.isInitialized()) return this.configureTargets()

    // Else configure once initialized
    this.el.sceneEl.addEventListener('realityready', this.configureTargets)
  },

  configureTargets () {
    XR8.XrController.configure({ imageTargets: [] }) // Wipe set
    XR8.XrController.configure({
      imageTargets: this.data.targets // Entries should match ID of the image target from 8th wall
    })
  }
}
