import { vibrate } from '../util/vibrate.js'

export const Recenter = {
  init () {
    const recenterButton = document.getElementById('recenter')
    const scene = this.el.sceneEl
    recenterButton.addEventListener('click', () => {
      vibrate(50)
      scene.emit('recenter')
    })
  }
}
