export const ImageTarget = {
  schema: {
    name: { type: 'string' },
    alignVideoSrc: { type: 'string', default: 'alignEnSrc' }
  },
  init () {
    const { object3D } = this.el
    const { name, alignVideoSrc } = this.data
    const scene = this.el.sceneEl
    object3D.visible = false
    const alignImg = document.getElementById('alignImg')
    const alignVideo = document.getElementById(alignVideoSrc)
    let isSeen = false
    window.canPlay = false

    // Set up entity in front of camera to run the alignment alpha video
    const camera = document.getElementById('camera')
    const alignPlane = document.createElement('a-entity')
    alignPlane.setAttribute('gltf-model', '#alignVideoPlane')
    alignPlane.setAttribute('position', '0 0 -1.4')
    alignPlane.setAttribute('rotation', '90 0 0')
    alignPlane.setAttribute('video-material-alpha-self', `videoSrc: ${alignVideoSrc}`)
    camera.appendChild(alignPlane)

    // Sanity check to prep the video to show on load
    alignVideo.addEventListener('canplay', () => {
      alignVideo.play()
      alignVideo.pause()
    })

    const showImage = ({ detail }) => {
      if (name !== detail.name) {
        console.log('Image target found, but name does not match schema')
        return
      }
      object3D.position.copy(detail.position)
      object3D.quaternion.copy(detail.rotation)
      object3D.scale.set(detail.scale, detail.scale, detail.scale)
      object3D.visible = true
    }

    const imageFound = (e) => {
      if (!window.videoOver) window.canPlay = true
      if (!isSeen) {
        isSeen = true
        window.dataLayer.push({ event: 'Print Image Target Scanned' })
        // Display the align image in case the marker is lost in the future
        setTimeout(() => {
          alignImg.style.display = 'block'
        }, 2000)
        // Play the align video, then remove the node
        console.log('PLAYING ALIGN VIDEO')
        alignVideo.play()
        alignVideo.addEventListener('ended', (evt) => {
          alignPlane.parentNode.removeChild(alignPlane)
        })
        const tapIcon = document.getElementById('tapIcon')
        tapIcon.setAttribute('animation__scale', {
          property: 'scale',
          to: { x: 0.32, y: 0.32, z: 0.32 },
          loop: true,
          dir: 'alternate',
          dur: 600,
          easing: 'easeInOutQuad'
        })
      } else {
        alignImg.classList.remove('fadeIn')
        alignImg.classList.add('fadeOut')
      }

      showImage(e)
    }

    const imageLost = (e) => {
      if (!window.videoOver) window.canPlay = false
      alignImg.classList.remove('fadeOut')
      alignImg.classList.add('fadeIn')
      object3D.visible = false
    }

    scene.addEventListener('xrimagefound', imageFound)
    scene.addEventListener('xrimageupdated', showImage)
    scene.addEventListener('xrimagelost', imageLost)
  }
}
