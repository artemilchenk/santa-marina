// Extracted from XRExtras

export const oneFingerRotateComponent = {
  schema: {
    factor: { default: 6 }
  },
  init () {
    this.handleEvent = this.handleEvent.bind(this)
    this.el.sceneEl.addEventListener('onefingermove', this.handleEvent)
    // this.el.classList.add('cantap') // Needs "objects: .cantap" attribute on raycaster.
  },
  remove () {
    this.el.sceneEl.removeEventListener('onefingermove', this.handleEvent)
  },
  handleEvent (event) {
    this.el.object3D.rotation.y += event.detail.positionChange.x * this.data.factor
  }
}

export const twoFingerRotateComponent = {
  schema: {
    factor: { default: 5 }
  },
  init () {
    this.handleEvent = this.handleEvent.bind(this)
    this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
    this.el.classList.add('cantap') // Needs "objects: .cantap" attribute on raycaster.
  },
  remove () {
    this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
  },
  handleEvent (event) {
    this.el.object3D.rotation.y += event.detail.positionChange.x * this.data.factor
  }
}

export const pinchScaleComponent = {
  schema: {
    min: { default: 0.33 },
    max: { default: 3 },
    scale: { default: 0 } // If scale is set to zero here, the object's initial scale is used.
  },
  init () {
    const s = this.data.scale
    this.initialScale = (s && { x: s, y: s, z: s }) || this.el.object3D.scale.clone()
    this.scaleFactor = 1
    this.handleEvent = this.handleEvent.bind(this)
    this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
    // this.el.classList.add('cantap') // Needs "objects: .cantap" attribute on raycaster.
  },
  remove () {
    this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
  },
  handleEvent (event) {
    this.scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread
    this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.min), this.data.max)

    this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
    this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
    this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z
  }
}

export const holdDragComponent = {
  schema: {
    cameraId: { default: 'camera' },
    groundId: { default: 'ground' },
    dragDelay: { default: 300 },
    riseHeight: { default: 1 }
  },
  init () {
    this.camera = document.getElementById(this.data.cameraId)
    if (!this.camera) {
      throw new Error(`[xrextras-hold-drag] Couldn't find camera with id '${this.data.cameraId}'`)
    }
    this.threeCamera = this.camera.getObject3D('camera')
    this.ground = document.getElementById(this.data.groundId)
    if (!this.ground) {
      throw new Error(`[xrextras-hold-drag] Couldn't find ground with id '${this.data.groundId}'`)
    }

    this.internalState = {
      fingerDown: false,
      dragging: false,
      distance: 0,
      startDragTimeout: null,
      raycaster: new THREE.Raycaster()
    }

    this.fingerDown = this.fingerDown.bind(this)
    this.startDrag = this.startDrag.bind(this)
    this.fingerMove = this.fingerMove.bind(this)
    this.fingerUp = this.fingerUp.bind(this)

    this.el.addEventListener('mousedown', this.fingerDown)
    this.el.sceneEl.addEventListener('onefingermove', this.fingerMove)
    this.el.sceneEl.addEventListener('onefingerend', this.fingerUp)
    this.el.classList.add('cantap') // Needs "objects: .cantap" attribute on raycaster.
  },
  tick () {
    if (this.internalState.dragging) {
      let desiredPosition = null
      if (this.internalState.positionRaw) {
        const screenPositionX = this.internalState.positionRaw.x / document.body.clientWidth * 2 - 1
        const screenPositionY = this.internalState.positionRaw.y / document.body.clientHeight * 2 - 1
        const screenPosition = new THREE.Vector2(screenPositionX, -screenPositionY)

        this.threeCamera = this.threeCamera || this.camera.getObject3D('camera')

        this.internalState.raycaster.setFromCamera(screenPosition, this.threeCamera)
        const intersects = this.internalState.raycaster.intersectObject(this.ground.object3D, true)

        if (intersects.length > 0) {
          const intersect = intersects[0]
          this.internalState.distance = intersect.distance
          desiredPosition = intersect.point
        }
      }

      if (!desiredPosition) {
        desiredPosition = this.camera.object3D.localToWorld(new THREE.Vector3(0, 0, -this.internalState.distance))
      }

      desiredPosition.y = this.data.riseHeight
      this.el.object3D.position.lerp(desiredPosition, 0.2)
    }
  },
  remove () {
    this.el.removeEventListener('mousedown', this.fingerDown)
    this.el.sceneEl.removeEventListener('onefingermove', this.fingerMove)
    this.el.sceneEl.removeEventListener('onefingerend', this.fingerUp)
    if (this.internalState.fingerDown) {
      this.fingerUp()
    }
  },
  fingerDown (event) {
    this.internalState.fingerDown = true
    this.internalState.startDragTimeout = setTimeout(this.startDrag, this.data.dragDelay)
    this.internalState.positionRaw = event.detail.positionRaw
  },
  startDrag (event) {
    if (!this.internalState.fingerDown) {
      return
    }
    this.internalState.dragging = true
    this.internalState.distance = this.el.object3D.position.distanceTo(this.camera.object3D.position)
  },
  fingerMove (event) {
    this.internalState.positionRaw = event.detail.positionRaw
  },
  fingerUp (event) {
    this.internalState.fingerDown = false
    clearTimeout(this.internalState.startDragTimeout)

    this.internalState.positionRaw = null

    if (this.internalState.dragging) {
      const endPosition = this.el.object3D.position.clone()
      this.el.setAttribute('animation__drop', {
        property: 'position',
        to: `${endPosition.x} 0 ${endPosition.z}`,
        dur: 300,
        easing: 'easeOutQuad'
      })
    }
    this.internalState.dragging = false
  }
}

export const MouseDragRotateComponent = {
  schema: { speed: { default: 2 } },
  init: function () {
    this.ifMouseDown = false
    this.x_cord = 0
    this.y_cord = 0
    document.addEventListener('mousedown', this.OnDocumentMouseDown.bind(this))
    document.addEventListener('mouseup', this.OnDocumentMouseUp.bind(this))
    document.addEventListener('mousemove', this.OnDocumentMouseMove.bind(this))
    this.el.addEventListener('mousedown', (event) => {
      console.log('mousedown on shirt')
      document.getElementById('camera').setAttribute('look-controls', 'enabled:false')
    })
    this.el.addEventListener('mouseup', (event) => {
      console.log('mouseup on shirt')
      document.getElementById('camera').setAttribute('look-controls', 'enabled:true')
    })
  },
  OnDocumentMouseDown: function (event) {
    this.ifMouseDown = true
    this.x_cord = event.clientX
    this.y_cord = event.clientY
  },
  OnDocumentMouseUp: function () {
    this.ifMouseDown = false
  },
  OnDocumentMouseMove: function (event) {
    if (this.ifMouseDown) {
      const tempX = event.clientX - this.x_cord
      const tempY = event.clientY - this.y_cord
      if (Math.abs(tempY) < Math.abs(tempX)) {
        this.el.object3D.rotateY(tempX * this.data.speed / 1000)
      } else {
        // this.el.object3D.rotateX(tempY * this.data.speed / 1000)
      }
      this.x_cord = event.clientX
      this.y_cord = event.clientY
    }
  }
}

export const ScrollWheelZoomComponent = {
  schema: { defaultScale: { default: 0 } },
  init () {
    const s = this.data.scale
    this.initialScale = (s && { x: s, y: s, z: s }) || this.el.object3D.scale.clone()
    this.scaleFactor = 1
    window.addEventListener('wheel', (event) => {
      event.preventDefault()
      this.scaleFactor += event.deltaY * -0.001
      this.scaleFactor = Math.min(Math.max(this.scaleFactor, 0.33), 3)
      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z
    })
  }
}
