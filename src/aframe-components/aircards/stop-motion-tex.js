export const StopMotionTexture = {
  schema: {
    // querySelectorAll for the video elements in use (need one for every nodeName/texture)
    class: { type: 'string', default: '.smt' },
    // each video element should be of id="smt-nodeName"
    idPrefix: { type: 'string', default: 'smt-' },
    // string[] length frameSlices lists the mesh node.names to apply the tex to
    nodeNames: { type: 'array', default: [] },
    // number[][] listing the frames used by each mesh node, ints in livery order, arrays in nodeName order
    frameSlices: { type: 'array', default: [[]] },
    // string[] of length of frameSlices[n] listing the names of each texture set (livery)
    liveries: { type: 'array', default: [''] },
    // update this to swap between liveries
    livery: { type: 'string', default: 'onwardandupward' },
    // set to true to enable handy tap to swap debugging
    click: { type: 'boolean', default: false }
  },
  init () {
    this.loaded = false
    this.videos = document.querySelectorAll(this.data.class)
    this.videos.forEach((video, idx) => {
      if (idx >= Array.from(this.videos).length - 1) {
        if (video.readyState >= 4) {
          this.loaded = true
          console.log(video.duration)
        }
      }
    })
    // if video can play proceed with setup
    const proceedWithVideo = () => {
      this.model = this.el.getObject3D('mesh')
      this.liveries = this.data.liveries
      // key: node names
      // value: {texture: new THREE.VideoTexture, frames: copy of frames array in frameMap}
      this.texDatas = new Map()
      // key: node names
      // value: array of frames to choose from
      this.frameMap = new Map()

      // populate this.frameMap from schema
      this.data.nodeNames.forEach((nodeName, i) => {
        const maxArr = []
        this.data.frameSlices[i].forEach(frameInt => {
          maxArr.push(frameInt)
        })
        // get max frame (needs to be same as video framecount)
        this.framecount = Math.max(...maxArr)
        this.frameMap.set(nodeName, this.data.frameSlices[i])
      })

      // create and stor in texDatas the THREE.VideoTextures
      this.videos.forEach((video, idx) => {
        video.play()
        video.pause()
        const texture = new THREE.VideoTexture(video)
        const nodeName = video.id.replace(this.data.idPrefix, '')
        // make reference to texture and the frames it needs
        const obj = { texture: texture, frames: this.frameMap.get(nodeName) }
        // fill frameMap with key value pairs
        this.texDatas.set(nodeName, obj)
      })

      // first setup(this.model)
      if (this.model) {
        this.setup(this.model)
      } else {
        this.el.addEventListener(
          'model-loaded',
          (e) => {
            this.setup(e.detail.model)
          }
        )
      }
    }

    // if video can't play proceed when it can
    if (!this.loaded) {
      this.videos[this.videos.length - 1].addEventListener('canplay', proceedWithVideo, { once: true })
      return
    } else {
      proceedWithVideo()
    }

    // handy helper for testing
    if (this.data.click) {
      this.count = 1
      this.el.addEventListener('click', () => {
        this.el.setAttribute('stop-motion-tex', { livery: this.liveries[this.count % this.liveries.length] })
        this.count++
        console.log(this.el.getAttribute('stop-motion-tex'))
      })
    }
  },

  update () {
    if (!this.model) return
    const { livery } = this.data
    this.videos.forEach(video => {
      if (!video.duration) return
      const nodeName = video.id.replace(this.data.idPrefix, '')
      const texData = this.texDatas.get(nodeName) // texture that will be updated by video
      video.currentTime = texData.frames[this.liveries.indexOf(livery)] * video.duration / this.framecount - 0.001
      console.log(video.currentTime)
      this.model.traverse((node) => {
        if (node.name === nodeName) {
          node.material.map.needsUpdate = true
          node.material.needsUpdate = true
        }
      })
    })
  },

  setup (model) {
    this.model = model
    this.texDatas.forEach((texData, nodeName) => {
      model.traverse((node) => {
        if (node.name === nodeName) {
          texData.texture.wrapS = node.material.map.wrapS
          texData.texture.wrapT = node.material.map.wrapT
          texData.texture.flipY = node.material.map.flipY
          texData.texture.format = node.material.map.format
          texData.texture.encoding = node.material.map.encoding
          node.material.map = texData.texture
          node.material.needsUpdate = true
        }
      })
    })
    this.update()
  }

}
