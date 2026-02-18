export const SoundManager = {
  schema: {
    sounds: { type: 'array' },
    folder: { type: 'string', default: '' },
    backgroundTrack: { type: 'string', default: '' }
  },
  init () {
    const scene = this.el.sceneEl
    const { sounds, backgroundTrack } = this.data
    const folder = this.data.folder ? `${this.data.folder}/` : ''
    const prepSound = (sound) => {
      const loops = sound.toLowerCase().includes('loop') // a hacky way of embedding the looping prop in the filename
      const hostName = window.location.href.split('?')[0] // remove query params
      const soundSrc = `${hostName}public/audio/${folder}${sound}.mp3`
      // Caveat as of May 2021:
      //   iOS 14 requires the html5: true flag from howler to play sound,
      //   but .fade and .volume only work when html5: false (aka web audio instead)
      // Update as of Aug 2021:
      //   This appears to be fixed for iOS 14.7+ (lower versions may also be supported)
      const howlSound = new window.Howl({
        preload: true,
        html5: false,
        src: [soundSrc],
        loop: loops,
        onend: function () {
          scene.emit('soundEnded', sound)
        }
      })

      scene.addEventListener('playSound', (event) => {
        // console.log(event.detail.soundName)
        // console.log(howlSound)
        if (event.detail.soundName === sound) {
          if (howlSound.playing()) return
          howlSound.play()
        }
      })

      scene.addEventListener('fadeSound', (event) => {
        // console.log(event.detail.soundName)
        // console.log(howlSound)
        if (event.detail.soundName === sound) {
          howlSound.fade(1, 0, 1000)
          setTimeout(() => {
            howlSound.stop()
            howlSound.fade(0, 1, 1)
          }, 1000)
        }
      })

      scene.addEventListener('pauseSound', (event) => {
        // console.log(event.detail.soundName)
        // console.log(howlSound)
        if (event.detail.soundName === sound) howlSound.pause()
      })

      scene.addEventListener('stopSound', (event) => {
        // console.log(event.detail.soundName)
        // console.log(howlSound)
        if (event.detail.soundName === sound) howlSound.stop()
      })

      scene.addEventListener('unloadSound', (event) => {
        // console.log(event.detail.soundName)
        // console.log(howlSound)
        if (event.detail.soundName === sound) howlSound.unload()
      })
    }

    sounds.forEach((sound) => {
      prepSound(sound)
    })

    if (backgroundTrack) prepSound(backgroundTrack)

    // Play the main audio track on user interaction, except when on desktop
    if (backgroundTrack && XR8.XrDevice.isDeviceBrowserCompatible()) {
      document.body.addEventListener('click', () => {
        if (window.desktopDebug) return
        scene.emit('playSound', { soundName: backgroundTrack })
      }, { once: true })
    }
  }
}
