// set the scene.environment to be a static cube texture
// use with use-scene-env if dynamically adding meshes to scene
import { useAppStore } from '~/stores/app-store'
const toUrl = (urlOrId) => {
  const img = document.querySelector(urlOrId)
  return img ? img.src : urlOrId
}
export const SceneEnv = {
  schema: {
    posx: { default: '#posx' },
    posy: { default: '#posy' },
    posz: { default: '#posz' },
    negx: { default: '#negx' },
    negy: { default: '#negy' },
    negz: { default: '#negz' },
    envmapRealtime: { default: false },
    backgroundRealtime: { default: false },
    envmapRealtimeBrightness: { default: 5 }
  },
  update () {
    const appStore = useAppStore()
    appStore.setAppState('set appState from aframe scene-env component')
    const { data } = this
    const scene = this.el.sceneEl
    const mirroredDisplay = scene.getAttribute('xrface')?.mirroredDisplay

    const staticCubemap = new THREE.CubeTextureLoader().load([
      toUrl(data.posx), toUrl(data.negx),
      toUrl(data.posy), toUrl(data.negy),
      toUrl(data.posz), toUrl(data.negz)
    ])
    if (!data.envmapRealtime) scene.object3D.environment = staticCubemap

    if (data.envmapRealtime || data.backgroundRealtime) {
      let cameraFeedRenderer = null
      // const renderTex_ = null
      let canvasWidth_ = null
      let canvasHeight_ = null
      let videoWidth_ = null
      let videoHeight_ = null
      let texProps = null

      const updateSize = ({ videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx }) => {
        cameraFeedRenderer = XR8.GlTextureRenderer.create({
          GLctx,
          toTexture: { width: canvasWidth, height: canvasHeight },
          flipY: !!mirroredDisplay

        })
        canvasWidth_ = canvasWidth
        canvasHeight_ = canvasHeight
        videoWidth_ = videoWidth
        videoHeight_ = videoHeight
      }
      const onxrloaded = () => {
        scene.renderer.shadowMap.enabled = true
        scene.renderer.outputEncoding = THREE.LinearEncoding
        const cubeMapScene = new THREE.Scene()
        const camTexture_ = new THREE.Texture()
        const refMat = new THREE.MeshStandardMaterial({
          side: THREE.DoubleSide,
          color: 0xffffff,
          map: camTexture_
        })
        const renderTarget = new THREE.WebGLCubeRenderTarget(256, {
          format: THREE.RGBFormat,
          generateMipmaps: true,
          minFilter: THREE.LinearMipmapLinearFilter,
          encoding: THREE.sRGBEncoding
        })
        const sphere = new THREE.SphereGeometry(100, 15, 15)
        const sphereMesh = new THREE.Mesh(sphere, refMat)
        sphereMesh.scale.set(-1, 1, 1)
        sphereMesh.rotation.set(Math.PI, -Math.PI / 2, 0)
        cubeMapScene.add(sphereMesh)
        const ambientLight = new THREE.PointLight(0xffffff, data.envmapRealtimeBrightness, 250)
        cubeMapScene.add(ambientLight)
        const cubeCamera = new THREE.CubeCamera(1, 1000, renderTarget)
        if (data.backgroundRealtime) scene.object3D.background = camTexture_
        if (data.envmapRealtime) scene.object3D.environment = cubeCamera.renderTarget.texture

        window.XR8.XrController.configure({ enableLighting: true })

        window.XR8.addCameraPipelineModule({
          name: 'cubemap-process',
          onAttach: ({ videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx }) => {
            updateSize({ videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx })
          },
          onUpdate: ({ processCpuResult }) => {
            cubeCamera.update(scene.renderer, cubeMapScene)
            const { reality, facecontroller } = processCpuResult
            console.log('processCpuResult', processCpuResult)
            if (!reality && facecontroller) {
              texProps.__webglTexture = cameraFeedRenderer.render({ renderTexture: processCpuResult.facecontroller.cameraFeedTexture, viewport: XR8.GlTextureRenderer.fillTextureViewport(videoWidth_, videoHeight_, canvasWidth_, canvasHeight_) })
              if (mirroredDisplay) {
                camTexture_.center = new THREE.Vector2(0.5, 0.5)
                camTexture_.rotation = Math.PI
              }
            } else if (reality) {
              texProps.__webglTexture = cameraFeedRenderer.render({ renderTexture: reality.realityTexture, viewport: XR8.GlTextureRenderer.fillTextureViewport(videoWidth_, videoHeight_, canvasWidth_, canvasHeight_) })
            }
          },
          onProcessCpu: ({ frameStartResult }) => {
            const { cameraTexture } = frameStartResult
            // force initialization
            texProps = scene.renderer.properties.get(camTexture_)
            texProps.__webglTexture = cameraTexture
          },
          onDeviceOrientationChange: ({ videoWidth, videoHeight, GLctx }) => {
            updateSize({ videoWidth, videoHeight, canvasWidth_, canvasHeight_, GLctx })
          },
          onVideoSizeChange: ({ videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx }) => {
            updateSize({ videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx })
          },

          onCanvasSizeChange: ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
            updateSize({ videoWidth, videoHeight, canvasWidth, canvasHeight, GLctx })
          }
        })
        scene.emit('scene-env-updated')
      }
      window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
    } else {
      scene.emit('scene-env-updated')
    }
  }
}

// use with scene-env to set a mesh's envMap if the mesh has been created after the scene.environment is set

export const UseSceneEnv = {
  init () {
    this.el.sceneEl.addEventListener('scene-env-updated', () => {
      this.el.getObject3D('mesh')?.traverse((node) => {
        if (!node.isMesh) return
        node.material.envMap = this.el.sceneEl.object3D.environment
        node.material.needsUpdate = true
      })
    })
  },
  update () {
    console.log('updating')
    console.log(this.el)
    const model = this.el.getObject3D('mesh')

    if (model) {
      this.override(model)
    } else {
      this.el.addEventListener(
        'model-loaded',
        (e) => {
          this.override(e.detail.model)
        }
      )
    }
  },

  override (model) {
    model.traverse((node) => {
      if (!node.isMesh) return
      node.material.envMap = this.el.sceneEl.object3D.environment
      node.material.needsUpdate = true
    })
  }
}
