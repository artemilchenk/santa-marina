// from https://github.com/aframevr/aframe/issues/4134
export const IosHlsFix = {
  init: function () {
    const el = this.el
    el.addEventListener('materialvideoloadeddata', e => {
      el.setAttribute('material', 'shader', 'flat')
      e.detail.texture.flipY = true
    })
  }
}
