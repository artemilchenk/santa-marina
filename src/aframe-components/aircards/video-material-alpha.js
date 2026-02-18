export const VideoMaterialAlpha = {
  schema: {
    diffSrc: { type: 'string' },
    alphaSrc: { type: 'string' }
  },
  init () {
    const { diffSrc, alphaSrc } = this.data
    this.model = null
    this.mixer = null

    const model = this.el.getObject3D('mesh')

    if (model) {
      this.load(model, diffSrc, alphaSrc)
    } else {
      this.el.addEventListener(
          'model-loaded',
          (e) => {
            this.load(e.detail.model, diffSrc, alphaSrc)
          }
      )
    }
  },

  load (model, diffSrc, alphaSrc) {
    this.model = model

    // Create the texture for overriding
    // var texture = new THREE.TextureLoader().load(
    //   "https://threejsfundamentals.org/threejs/resources/images/wall.jpg"
    // );
    // const scene = this.el.sceneEl
    const diffVideo = document.getElementById(diffSrc)
    const alphaVideo = document.getElementById(alphaSrc)

    const diffVideoTexture = new THREE.VideoTexture(diffVideo)
    diffVideoTexture.minFilter = THREE.LinearFilter
    diffVideoTexture.wrapS = THREE.ClampToEdgeWrapping
    diffVideoTexture.wrapT = THREE.ClampToEdgeWrapping
    // diffVideoTexture.wrapS = THREE.RepeatWrapping
    // diffVideoTexture.wrapT = THREE.RepeatWrapping
    diffVideoTexture.flipY = false
    diffVideoTexture.encoding = THREE.sRGBEncoding
    // diffVideoTexture.repeat = 2
    // diffVideoTexture.offset.set(0.5, 0)
    // diffVideoTexture.repeat.set( 2, 2 );

    const alphaVideoTexture = new THREE.VideoTexture(alphaVideo)
    alphaVideoTexture.minFilter = THREE.LinearFilter
    alphaVideoTexture.wrapS = THREE.ClampToEdgeWrapping
    alphaVideoTexture.wrapT = THREE.ClampToEdgeWrapping
    // alphaVideoTexture.wrapS = THREE.RepeatWrapping
    // alphaVideoTexture.wrapT = THREE.RepeatWrapping
    alphaVideoTexture.flipY = false
    // alphaVideoTexture.offset.set(-0.5, 0)

    // FUNCTIONAL ALPHA MAP
    const overMat = new THREE.MeshBasicMaterial({
      map: diffVideoTexture,
      alphaMap: alphaVideoTexture,
      transparent: true
    })

    // Prep the video
    // diffVideo.play()
    // diffVideo.pause()
    // alphaVideo.play()
    // alphaVideo.pause()

    this.model.traverse((node) => {
      // console.log(node.name)
      // only apply to the node we want
      // APPLY THE VIDEO TEXTURE
      node.material = overMat
      node.material.needsUpdate = true
    })
  }
}
