// THI IS A WIP COMPONENT
// responsive-immersive uses 8th Wall's sessionAttributes to estimate the device and configure immersive content accordingly
// The Aircards DeviceInfo component is a requirement for the mobile LOD check to work properly.
// KNOWN ISSUE: xrloaded does not fire unless xrweb is being used. For use cases without xrweb, onAttach won't run so this component does not work.
const ResponsiveImmersive = {
  init () {
    const onAttach = ({ sessionAttributes }) => {
      console.log('onAttach')
      const s = sessionAttributes
      console.log(s)
      if (
        !s.cameraLinkedToViewer &&
        !s.controlsCamera &&
        !s.fillsCameraTexture &&
        !s.supportsHtmlEmbedded &&
        s.supportsHtmlOverlay &&
        !s.usesMediaDevices &&
        !s.usesWebXr
      ) {  // Desktop-specific behavior goes here
        console.log('Device is desktop')
      } else if (
        s.cameraLinkedToViewer &&
        s.controlsCamera &&
        !s.fillsCameraTexture &&
        s.supportsHtmlEmbedded &&
        !s.supportsHtmlOverlay &&
        !s.usesMediaDevices &&
        s.usesWebXr
      ) {  // HMD-specific behavior goes here
        console.log('Device is HMD')
        if (this.el.sceneEl.xrSession.environmentBlendMode === 'opaque') {
          // VR HMD (i.e. Oculus Quest) behavior goes here

        } else if (this.el.sceneEl.xrSession.environmentBlendMode === 'additive' || 'alpha-blend') {
          // AR HMD (i.e. Hololens) behavior goes here

        }
      } else if (
        !s.cameraLinkedToViewer &&
        !s.controlsCamera &&
        s.fillsCameraTexture &&
        !s.supportsHtmlEmbedded &&
        s.supportsHtmlOverlay &&
        s.usesMediaDevices &&
        !s.usesWebXr
      ) {  // Mobile-specific behavior goes here
        console.log('Device is mobile')
        // Use Aircards DeviceInfo API to sort mobile devices into a high, mid or low LOD bracket
        if (window.deviceInfo.isAndroidHighEnd
        ) {
          window.deviceLOD = 'high'
        } else if (window.deviceInfo.isiPhoneHighEnd ||
          window.deviceInfo.isTablet) {
          window.deviceLOD = 'mid'
        } else {
          window.deviceLOD = 'low'
        }
        console.log('Mobile device is in the ', window.deviceLOD, ' LOD bracket.')
      }
    }
    const onxrloaded = () => {
      XR8.addCameraPipelineModules([{ name: 'responsiveImmersive', onAttach }])
    }
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
  },
}
export { ResponsiveImmersive }