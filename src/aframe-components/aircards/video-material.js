export const VideoMaterial = {
  schema: {
    videoSrc: { type: 'string' },
    realTimeSwap: { default: false },
    nodeName: { type: 'string', default: '' },
    animation: { type: 'boolean', default: false },
    morphTargets: { type: 'boolean', default: false }
  },
  init () {
    this.model = null
    this.mixer = null

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
    const { videoSrc, realTimeSwap, nodeName, animation, morphTargets } = this.data

    // const scene = this.el.sceneEl
    const video = document.getElementById(videoSrc)

    if (!realTimeSwap) {
      video.play()
      video.pause()
    }

    const texture = new THREE.VideoTexture(video)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBFormat
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.flipY = false
    texture.encoding = THREE.sRGBEncoding

    const overMat = new THREE.MeshBasicMaterial({
      map: texture
    })

    // Go over the submeshes and modify materials we want.
    this.model.traverse((node) => {
      // console.log(node.name)
      if (node.isMesh) {
        if (nodeName && !node.name.includes(nodeName)) return
        // APPLY THE VIDEO TEXTURE
        node.material = overMat
        node.material.map = texture
        node.material.skinning = animation
        node.material.morphTargets = morphTargets
        node.material.needsUpdate = true
      }
      // /////////////////////
      // NOTE: When applying a new texture to an animated GLTF, you may have to set 'skinning' and 'morphTargets' true
      // https://stackoverflow.com/questions/60323149/updated-textures-stops-animation-in-three-js
      // /////////////////////
    })
  }
}
