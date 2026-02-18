/**
 * Alongpath component for A-Frame.
 * Move Entities along a predefined Curve
 */
export const AlongPath = {

  // dependencies: ['curve'],

  schema: {
    curve: { default: '' },
    triggers: { default: 'a-curve-point' },
    triggerRadius: { type: 'number', default: 0.01 },
    dur: { default: 1000 },
    delay: { default: 0 },
    loop: { default: false },
    rotate: { default: false },
    resetonplay: { default: true },
    easing: { default: 'linear' },
    relativeTo: { default: '' }
  },

  init: function () {
    // Easing functions based on https://gist.github.com/gre/1650294#gistcomment-1806616
    const EaseIn = function (power) { return function (t) { return Math.pow(t, power) } }
    const EaseOut = function (power) { return function (t) { return 1 - Math.abs(Math.pow(t - 1, power)) } }
    const EaseInOut = function (power) { return function (t) { return t < 0.5 ? EaseIn(power)(t * 2) / 2 : EaseOut(power)(t * 2 - 1) / 2 + 0.5 } }

    this.EasingFunctions = {
      linear: EaseInOut(1),
      easeInQuad: EaseIn(2),
      easeOutQuad: EaseOut(2),
      easeInOutQuad: EaseInOut(2),
      easeInCubic: EaseIn(3),
      easeOutCubic: EaseOut(3),
      easeInOutCubic: EaseInOut(3),
      easeInQuart: EaseIn(4),
      easeOutQuart: EaseOut(4),
      easeInOutQuart: EaseInOut(4),
      easeInQuint: EaseIn(5),
      easeOutQuint: EaseOut(5),
      easeInOutQuint: EaseInOut(5)
    }

    // We have to fetch curve and triggers manually because of an A-FRAME ISSUE
    // with Property-Type "Selector" / "SelectorAll": https://github.com/aframevr/aframe/issues/2517
  },

  update: function (oldData) {
    this.curve = document.querySelector(this.data.curve)
    this.triggers = this.curve.querySelectorAll(this.data.triggers)

    if (!this.curve) {
      console.warn("Curve not found. Can't follow anything...")
    } else {
      this.initialPosition = this.el.object3D.position
    }

    this.reset()
  },

  reset: function () {
    // Reset to initial state
    this.interval = 0

    this.el.removeState('endofpath')
    this.el.removeState('moveonpath')

    if (this.activeTrigger) {
      this.activeTrigger.removeState('alongpath-active-trigger')
      this.activeTrigger = null
    }
  },

  getI_: function (interval, delay, dur) {
    let i = 0

    if (interval - delay >= dur) {
      // Time is up, we should be at the end of the path
      i = 1
    } else if ((interval - delay < 0)) {
      // We are still waiting for the delay-time to finish
      // so keep entity at the beginning of the path
      i = 0
    } else {
      // Update path position based on timing and easing
      i = (interval - delay) / dur
      i = this.EasingFunctions[this.data.easing](i)
    }

    return i
  },

  tick: function (time, timeDelta) {
    const curve = this.curve.components.curve ? this.curve.components.curve.curve : null

    if (curve) {
      // Only update position if we didn't reach
      // the end of the path
      if (!this.el.is('endofpath')) {
        this.interval = this.interval + timeDelta

        const i = this.getI_(this.interval, this.data.delay, this.data.dur)

        if ((this.data.loop === false) && i >= 1) {
          // Set the end-position
          // Original code is broken, but used the last point
          // this.el.setAttribute('position', curve.points[curve.points.length - 1]);
          const p = curve.getPoint(1)
          this.el.setAttribute('position', p)

          // We have reached the end of the path and are not going
          // to loop back to the beginning therefore set final state
          this.el.removeState('moveonpath')
          this.el.addState('endofpath')
          this.el.emit('movingended')
        } else if ((this.data.loop === true) && i >= 1) {
          // We have reached the end of the path
          // but we are looping through the curve,
          // so restart here.
          this.el.emit('movingended')
          this.interval = this.data.delay
        } else {
          // We are starting to move or somewhere in the middle of the path…
          if (!this.el.is('moveonpath')) {
            this.el.addState('moveonpath')
            this.el.emit('movingstarted')
          }

          // …updating position
          const p = curve.getPoint(i)
          this.el.setAttribute('position', p)
        }

        // Update Rotation of Entity
        if (this.data.rotate === true) {
          const nextInterval = this.interval + timeDelta
          const nextPosition = curve.getPoint(this.getI_(nextInterval, this.data.delay, this.data.dur))

          // Get the world position of the nextPosition
          if (this.el.object3D.parent !== this.el.sceneEl.object3D) {
            this.el.object3D.parent.localToWorld(nextPosition)
          }

          // Look at the scene-level position of the next path position
          this.el.object3D.lookAt(nextPosition)

          // Orient this.el realtive to a spherical entity (relativeTo param), such as grounding to a planet
          if (this.data.relativeTo) {
            const relativeEl = document.querySelector(this.data.relativeTo)
            // Create a normalized vector pointing from the origin of relativeEl towards this.el
            const relativeAngle = new THREE.Vector3()
            relativeAngle.subVectors(this.el.object3D.position, relativeEl.object3D.position).normalize()
            // Rotate this.el on the z-axis (lookAt only modifies x and y),
            // Effectively pointing the bottom of this.el towards relativeTo
            const angle = new THREE.Vector3(0, 1, 0).angleTo(relativeAngle)
            this.el.object3D.rotateOnAxis(new THREE.Vector3(0, 0, 1), angle)
          }
        }

        // Check for Active-Triggers
        if (this.triggers && (this.triggers.length > 0)) {
          this.updateActiveTrigger()
        }
      }
    } else {
      console.error('The entity associated with the curve property has no curve component.')
    }
  },

  play: function () {
    if (this.data.resetonplay) {
      this.reset()
    }
  },

  remove: function () {
    this.el.object3D.position.copy(this.initialPosition)
  },

  updateActiveTrigger: function () {
    for (let i = 0; i < this.triggers.length; i++) {
      if (this.triggers[i].object3D) {
        if (this.triggers[i].object3D.position.distanceTo(this.el.object3D.position) <= this.data.triggerRadius) {
          // If this element is not the active trigger, activate it - and if necessary deactivate other triggers.
          if (this.activeTrigger && (this.activeTrigger !== this.triggers[i])) {
            this.activeTrigger.removeState('alongpath-active-trigger')
            this.activeTrigger.emit('alongpath-trigger-deactivated')

            this.activeTrigger = this.triggers[i]
            this.activeTrigger.addState('alongpath-active-trigger')
            this.activeTrigger.emit('alongpath-trigger-activated')
          } else if (!this.activeTrigger) {
            this.activeTrigger = this.triggers[i]
            this.activeTrigger.addState('alongpath-active-trigger')
            this.activeTrigger.emit('alongpath-trigger-activated')
          }

          break
        } else {
          // If this Element was the active trigger, deactivate it
          if (this.activeTrigger && (this.activeTrigger === this.triggers[i])) {
            this.activeTrigger.removeState('alongpath-active-trigger')
            this.activeTrigger.emit('alongpath-trigger-deactivated')
            this.activeTrigger = null
          }
        }
      }
    }
  }

}
