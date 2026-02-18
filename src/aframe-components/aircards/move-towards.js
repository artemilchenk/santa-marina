// attach this component to a camera rig entity and ensure xrextras-gesture-detector is enabled
// on tap the camera rig will move forward in the direction the user is facing.
// an animated player model defined by a query selector in the model param is required within the camera rig entity.
export const MoveTowards = {
  schema: {
    forward: { type: 'string' },
    idle: { type: 'string' },
    backward: { type: 'string' },
    speed: { type: 'number', default: 0.1 },
    model: { type: 'string', default: '#player' },
    enabled: { type: 'boolean', default: true }, // querySelector for animated player model entity
    constraint: { type: 'string' } // querySelectorAll for entity mesh(es) to inhibit movement when approached
  },
  init () {
    this.direction = new THREE.Vector3()
    this.raycaster = new THREE.Raycaster()
    this.camera = document.getElementById('camera')
    this.player = this.el.querySelector(this.data.model)
    this.handleTouch = AFRAME.utils.bind(this.handleTouch, this)
    this.clearTouch = AFRAME.utils.bind(this.clearTouch, this)
    if (this.data.constraint) {
      const objects = () => {
        const arr = []
        document.querySelectorAll(this.data.constraint).forEach((obj) => {
          arr.push(obj.getObject3D('mesh'))
        })
        return arr
      }
      this.objects = objects()
    }

    window.addEventListener('onefingerstart', this.handleTouch)
    window.addEventListener('onefingermove', this.handleTouch)
    window.addEventListener('onefingerend', this.clearTouch)
  },
  handleTouch () {
    this.touchActive = true
    this.player.setAttribute('animation__rot', {
      property: 'object3D.rotation.x',
      to: THREE.Math.degToRad(-54)
    })
    this.player.setAttribute('animation-mixer', {
      clip: this.data.forward,
      timeScale: 5,
      loop: 'repeat',
      crossFadeDuration: 0.4
    })
  },
  clearTouch () {
    this.touchActive = false
    this.player.setAttribute('animation-mixer', {
      clip: this.data.idle,
      loop: 'repeat',
      timeScale: 1,
      crossFadeDuration: 0.4
    })
    this.player.setAttribute('animation__rot', {
      property: 'object3D.rotation.x',
      to: THREE.Math.degToRad(0)
    })
  },
  tick () {
    if (!this.touchActive) return
    if (!this.data.enabled) return
    if (this.data.constraint) {
      // constrain movement if a constraint mesh is specified
      const a = new THREE.Vector2(0, -0.1)
      this.threeCamera = this.threeCamera || this.camera.getObject3D('camera')
      this.raycaster.setFromCamera(a, this.threeCamera)
      const intersects = this.raycaster.intersectObjects(this.objects, true)
      console.log(intersects[0])
      if (intersects[0].distance <= 4) return
    }
    // get the cameras world direction
    this.camera.object3D.getWorldDirection(this.direction)
    // multiply the direction by a "speed" factor
    this.direction.multiplyScalar(-this.data.speed)
    // get the current position
    const pos = this.el.getAttribute('position')
    // add the direction vector
    pos.add(this.direction)
    // set the new position
    this.el.setAttribute('position', pos)
    // !!! NOTE - it would be more efficient to do the
    // position change on the players THREE.Object:
    // `this.el.object3D.position.add(direction)`
    // but it would break "getAttribute("position")
  },
  remove () {
    window.removeEventListener('onefingerstart', this.handleTouch)
    window.removeEventListener('onefingermove', this.handleTouch)
    window.removeEventListener('onefingerend', this.clearTouch)
  }
}
