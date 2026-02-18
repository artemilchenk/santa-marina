const QRCode = require('qrcode')
export const CustomLoading = {
  schema: {
    is8wBranded: { type: 'boolean', default: true },
    loadImage: { type: 'selector', default: '#loadingImage' },
    loadAnimation: { type: 'string', default: 'scale' },
    allowedDevices: { type: 'string', default: 'mobile' }
  },
  init () {
    // ///////////
    // UI ELEMENTS
    // ///////////
    const scene = this.el.sceneEl
    const camera = document.getElementById('camera')
    const clp = document.getElementById('c-l-prompt')
    const clc = document.getElementById('c-l-continue')
    const cld = document.getElementById('c-l-deny')
    const qrCanvas = document.getElementById('c-l-qrCanvas')
    const qrContainer = document.getElementById('c-l-qrContainer')
    const qrLink = document.getElementById('c-l-qrLink')
    const arLogo = document.getElementById('c-l-arLogo')
    const poweredBy = document.getElementById('c-l-poweredByLogo')
    const clientLogo = document.getElementById('c-l-clientLogo')

    this.container = document.getElementById('c-l-container')
    this.loading = document.getElementById('c-l-loading')
    this.spinner = document.getElementById('c-l-spinner')
    this.loadingImg = document.getElementById('c-l-loadingImg')
    this.fallback = document.getElementById('c-l-fallback')

    scene.setAttribute('vr-mode-ui', 'enabled: false')
    scene.setAttribute('device-orientation-permission-ui', 'enabled: false')
    camera.setAttribute('look-controls', { touchEnabled: false })

    // ////////////
    // BIND METHODS
    // ////////////
    this.revealScene = this.revealScene.bind(this)
    this.showPermissionsFallback = this.showPermissionsFallback.bind(this)
    this.confirmSceneReady = this.confirmSceneReady.bind(this)
    this.showLoadingImg = this.showLoadingImg.bind(this)
    this.handlePermissions = this.handlePermissions.bind(this)

    // //////////////
    // PLATFORM LOGIC
    // //////////////

    // if device is a mobile phone
    this.isMobile = /IEMobile|Windows Phone|Lumia|iPhone|iPad|iPod|Android|Blackberry|Playbook|BB10|Mobile Safari|webOs|Mobile|Tablet|Opera Mini|Opera Mobi/i.test(navigator.userAgent)
    // if device orientation permissions have been granted by the user (always true on android)
    this.permissionsGranted = false
    // if a-assets have finished loading
    this.assetsLoaded = false

    // handle loading image
    this.loadingImg.src = this.data.loadImage.src
    // handle desktop
    if (!this.isMobile && this.data.allowedDevices === 'mobile') {
      // handle qr code
      qrContainer.classList.add('fadeIn')
      qrContainer.style.display = 'flex'
      QRCode.toCanvas(qrCanvas, window.location.href, function (error) {
        if (error) console.error(error)
        console.log('qrcode generated')
      })
      qrLink.innerText = window.location.href
      this.loading.remove()
      if (!this.data.is8wBranded) {
        // handle client logo
        arLogo.style.height = '70px'
        clientLogo.src = this.loadingImg.src
        clientLogo.style.display = 'block'
        clientLogo.classList.add('fadeIn')
      }
    }

    // handle powered by logo
    if (this.data.is8wBranded) {
      poweredBy.classList.add('fadeIn')
      poweredBy.style.display = 'block'
    } else {
      arLogo.classList.add('fadeIn')
      arLogo.style.display = 'block'
    }

    // handle device permissions
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // handle iOS 13+ devices
      clp.classList.add('fadeIn')
      clp.style.display = 'flex'
      clc.addEventListener('click', () => {
        clp.remove()
        this.handlePermissions()
      })
      cld.addEventListener('click', () => {
        clp.remove()
        this.showPermissionsFallback()
      })
    } else {
      // handle regular non iOS 13+ devices
      this.permissionsGranted = true
    }

    // show loading image when ready
    if (this.loadingImg.complete || this.loadingImg.naturalHeight !== 0) {
      this.showLoadingImg()
    } else {
      this.loadingImg.addEventListener('load', () => {
        this.showLoadingImg()
      })
    }

    // ensure all a-assets are loaded
    // if (aAssets.hasLoaded) {
    //   this.assetsLoaded = true
    //   this.confirmSceneReady()
    // } else {
    //   aAssets.addEventListener('loaded', () => {
    //     this.assetsLoaded = true
    //     this.confirmSceneReady()
    //   })
    // }
    let loadedAssets = 0
    let totalAssets = 0
    const assets = this.el.getElementsByTagName('a-entity')
    for (let i = 0; i < assets.length; i++) {
      if (assets[i].getAttribute('gltf-model')) {
        totalAssets++
        if (assets[i].hasLoaded &&
          assets[i].object3D &&
          assets[i].object3D.children &&
          assets[i].object3D.children.length > 0) {
          loadedAssets++
        } else {
          assets[i].addEventListener('model-loaded', () => {
            loadedAssets++
            if (loadedAssets === totalAssets) {
              this.assetsLoaded = true
              this.confirmSceneReady()
            }
          }, { once: true })
        }
      }
    }
    if (loadedAssets === totalAssets) {
      this.assetsLoaded = true
      this.confirmSceneReady()
    }
  },
  handlePermissions () {
    DeviceOrientationEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === 'granted') {
          this.permissionsGranted = true
          this.confirmSceneReady()
        } else {
          this.showPermissionsFallback()
        }
      })
      .catch(() => {
        this.showPermissionsFallback()
      })
  },
  showLoadingImg () {
    this.spinner.style.display = 'none'
    this.loadingImg.className = `fadeIn ${this.data.loadAnimation}`
    this.loadingImg.style.display = 'block'
  },
  confirmSceneReady () {
    if (this.permissionsGranted && this.assetsLoaded) {
      if (this.data.allowedDevices === 'any' ||
      (this.data.allowedDevices === 'mobile' && this.isMobile)) {
        this.revealScene()
      }
    }
  },
  revealScene () {
    setTimeout(() => {
      this.container.classList.add('fadeOutFast')
      setTimeout(() => {
        this.container.remove()
      }, 500)
    }, 3000) //  delay because textures are not always ready after a-assets are loaded
  },
  showPermissionsFallback () {
    this.fallback.classList.add('fadeIn')
    this.fallback.style.display = 'flex'
  }
}
