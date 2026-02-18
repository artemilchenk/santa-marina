export const ShowAfterLoad = {
  schema: {
    showEl: { type: 'string', default: '#gui' }
  },
  init () {
  // Show GUI on load
    const scene = this.el.sceneEl
    const loadEl = document.querySelector(this.data.showEl)

    const show = () => {
      loadEl.style.display = 'block'
    }

    if (window.desktopDebug) show()
    scene.addEventListener('realityready', show)
  }
}
