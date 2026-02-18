const LoopMode = {
  once: THREE.LoopOnce,
  repeat: THREE.LoopRepeat,
  pingpong: THREE.LoopPingPong
}

/**
 * Creates a RegExp from the given string, converting asterisks to .* expressions,
 * and escaping all other characters.
 */
function wildcardToRegExp (s) {
  return new RegExp(`^${s.split(/\*+/).map(regExpEscape).join('.*')}$`)
}

/**
 * RegExp-escapes all characters in the given string.
 */
function regExpEscape (s) {
  return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
}

/**
 * remote-animation-mixer
 *
 * Player for animation clips from a different model. Intended to be compatible with any model format that supports
 * skeletal or morph animations through THREE.AnimationMixer.
 * See: https://threejs.org/docs/?q=animation#Reference/Animation/AnimationMixer
 * Modified from the aframe-extras v6.1.1 animation-mixer, NOT master
 * See: https://github.com/n5ro/aframe-extras/blob/v6.1.1/src/loaders/animation-mixer.js
 */
export const RemoteAnimationMixer = {
  schema: {
    remoteId: { default: 'animated', type: 'string' },
    clip: { default: '*', type: 'string' },
    duration: { default: 0, type: 'number' },
    clampWhenFinished: { default: false, type: 'boolean' },
    crossFadeDuration: { default: 0, type: 'number' },
    loop: { default: 'repeat', oneOf: Object.keys(LoopMode) },
    repetitions: { default: Infinity, min: 0 },
    timeScale: { default: 1 }
  },

  init () {
    /** @type {THREE.Mesh} */
    this.model = null
    /** @type {THREE.Mesh} */
    this.remoteModel = null
    /** @type {THREE.AnimationMixer} */
    this.mixer = null
    /** @type {Array<THREE.AnimationAction>} */
    this.activeActions = []
    /** @type {Boolean} */
    this.hasLoaded = false

    // Bindings
    this.load = AFRAME.utils.bind(this.load, this)
    this.emitLoop = AFRAME.utils.bind(this.emitLoop, this)
    this.emitFinished = AFRAME.utils.bind(this.emitFinished, this)

    // Get the remote entity
    // Note: This should be the A-Frame entity, not the GLTF model asset
    let { remoteId } = this.data
    remoteId = remoteId.charAt(0) === '#' ? remoteId.slice(1) : remoteId // Remove '#' if necessary
    const remoteEl = document.getElementById(remoteId)
    if (!remoteEl) console.error('remote-animation-mixer: Remote entity not found. Pass the ID of the entity, not the model.')

    this.model = this.el.getObject3D('mesh')
    this.remoteModel = remoteEl.getObject3D('mesh')

    const tryToLoad = () => {
      if (!this.model || !this.remoteModel) return
      this.load()
    }

    if (this.model) {
      tryToLoad()
    } else {
      this.el.addEventListener('model-loaded', (e) => {
        this.model = e.detail.model
        tryToLoad()
      }, { once: true })
    }

    if (this.remoteModel) {
      tryToLoad()
    } else {
      remoteEl.addEventListener('model-loaded', (e) => {
        this.remoteModel = e.detail.model
        tryToLoad()
      }, { once: true })
    }
  },

  load () {
    this.model.animations = [...this.remoteModel.animations]
    this.mixer = new THREE.AnimationMixer(this.model)
    this.mixer.addEventListener('loop', this.emitLoop)
    this.mixer.addEventListener('finished', this.emitFinished)
    if (this.data.clip) this.update({})
    this.hasLoaded = true
    this.el.emit('remote-animation-mixer-loaded')
  },

  emitLoop (e) {
    this.el.emit('animation-loop', { action: e.action, loopDelta: e.loopDelta })
  },

  emitFinished (e) {
    this.el.emit('animation-finished', { action: e.action, direction: e.direction })
  },

  remove () {
    if (this.mixer) this.mixer.stopAllAction()
    this.mixer.removeEventListener('loop', this.emitLoop)
    this.mixer.removeEventListener('finished', this.emitFinished)
  },

  update (prevData) {
    if (!prevData) return

    const { data } = this
    const changes = AFRAME.utils.diff(data, prevData)

    // If selected clips have changed, restart animation.
    if ('clip' in changes) {
      this.stopAction()
      if (data.clip) this.playAction()
      return
    }

    // Otherwise, modify running actions.
    this.activeActions.forEach((action) => {
      if ('duration' in changes && data.duration) {
        action.setDuration(data.duration)
      }
      if ('clampWhenFinished' in changes) {
        action.clampWhenFinished = data.clampWhenFinished
      }
      if ('loop' in changes || 'repetitions' in changes) {
        action.setLoop(LoopMode[data.loop], data.repetitions)
      }
      if ('timeScale' in changes) {
        action.setEffectiveTimeScale(data.timeScale)
      }
    })
  },

  stopAction () {
    const { data } = this
    for (let i = 0; i < this.activeActions.length; i++) {
      data.crossFadeDuration
        ? this.activeActions[i].fadeOut(data.crossFadeDuration)
        : this.activeActions[i].stop()
    }
    this.activeActions = []
  },

  playAction () {
    if (!this.mixer) return

    const { model } = this
    const { data } = this
    const clips = model.animations || (model.geometry || {}).animations || []

    if (!clips.length) return

    const re = wildcardToRegExp(data.clip)

    for (let clip, i = 0; (clip = clips[i]); i++) {
      if (clip.name.match(re)) {
        const action = this.mixer.clipAction(clip, model)

        action.enabled = true
        action.clampWhenFinished = data.clampWhenFinished
        if (data.duration) action.setDuration(data.duration)
        if (data.timeScale !== 1) action.setEffectiveTimeScale(data.timeScale)
        action
          .setLoop(LoopMode[data.loop], data.repetitions)
          .fadeIn(data.crossFadeDuration)
          .play()

        this.activeActions.push(action)
      }
    }
  },

  tick (t, dt) {
    if (this.mixer && !Number.isNaN(dt)) this.mixer.update(dt / 1000)
  }
}
