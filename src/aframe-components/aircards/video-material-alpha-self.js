export const VideoMaterialAlphaSelf = {
  schema: {
    videoSrc: { type: 'string' },
    autoPlay: { default: false },
    colorHex: { type: 'string' }
  },
  init () {
    // this.el.sceneEl.addEventListener('realityready', () => {
    const { videoSrc, colorHex } = this.data
    this.model = null
    this.mixer = null

    const model = this.el.getObject3D('mesh')

    if (model) {
      this.load(model, videoSrc, colorHex)
    } else {
      this.el.addEventListener(
          'model-loaded',
          (e) => {
            this.load(e.detail.model, videoSrc, colorHex)
          }
      )
    }
    // })
  },

  load (model, videoSrc, color) {
    this.model = model

    // const scene = this.el.sceneEl
    console.log(videoSrc)
    const alphaVideo = document.getElementById(videoSrc)
    console.log(alphaVideo)
    const videoTexture = new THREE.VideoTexture(alphaVideo)
    const alphaVideoTexture = new THREE.VideoTexture(alphaVideo)
    alphaVideoTexture.minFilter = THREE.LinearFilter
    alphaVideoTexture.wrapS = THREE.ClampToEdgeWrapping
    alphaVideoTexture.wrapT = THREE.ClampToEdgeWrapping
    alphaVideoTexture.flipY = false

    alphaVideo.play()
    if (!this.data.autoPlay) alphaVideo.pause()

    // FUNCTIONAL ALPHA MAP
    // map: videoTexture,
    const overMat = new THREE.MeshBasicMaterial({
      map: videoTexture,
      color: color,
      alphaMap: alphaVideoTexture,
      transparent: true
    })

    this.model.traverse((node) => {
      // APPLY THE VIDEO TEXTURE
      node.material = overMat
      node.material.needsUpdate = true
    })
  }
}
