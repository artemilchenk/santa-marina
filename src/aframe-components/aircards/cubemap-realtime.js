const ensureMaterialArray = (material) => {
  if (!material) {
    return []
  }
  if (Array.isArray(material)) {
    return material
  }
  if (material.materials) {
    return material.materials
  }
  return [material]
}

const CubeMapRealtime = {
  schema: {
    nodeNames: { type: 'string', default: '' }, // Use this param to target specific nodes
    materialNames: { type: 'string', default: '' }, // Use this param to target specific materials
    newMaterial: { type: 'boolean', default: false } // Use to avoid affecting other nodes sharing the same material
  },
  init () {
    // Els
    const scene = this.el.sceneEl

    // Bindings
    this.applyEnvMap = this.applyEnvMap.bind(this)
    this.updateModel = this.updateModel.bind(this)

    // Cubemap Three.js setup
    const cubeMapScene = new THREE.Scene()
    const camTexture_ = new THREE.Texture()
    const refMat = new THREE.MeshBasicMaterial({
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
    const cubeCamera = new THREE.CubeCamera(1, 1000, renderTarget)

    // To be called once XR8 is ready
    const configureCubemap = () => {
      window.XR8.XrController.configure({ enableLighting: true })
      window.XR8.addCameraPipelineModule({
        name: 'cubemap-process',
        onUpdate: () => {
          cubeCamera.update(scene.renderer, cubeMapScene)
        },
        onAttach: () => {
          window.XR8.cubeCamera = cubeCamera
        },
        onProcessCpu: ({ frameStartResult }) => {
          const { cameraTexture } = frameStartResult
          // force initialization
          const texProps = scene.renderer.properties.get(camTexture_)
          texProps.__webglTexture = cameraTexture
        }
      })
    }

    // When XR8 is ready, configure cubemap and apply the envmap to this el
    if (window.XR8) {
      configureCubemap()
      this.applyEnvMap(this.el)
    } else {
      this.el.sceneEl.addEventListener('realityready', () => {
        configureCubemap()
        this.applyEnvMap(this.el)
      }, { once: true })
    }
  },

  applyEnvMap (el) {
    if (!el) return
    if (!window.XR8.cubeCamera) {
      console.warn('Shared window.XR8.cubeCamera not ready yet')
      return setTimeout(() => {
        this.applyEnvMap(el)
      }, 100)
    }

    const envMap = window.XR8.cubeCamera.renderTarget.texture
    const mesh = el.getObject3D('mesh')

    // Ensure the model is loaded before updating materials
    if (mesh) {
      this.updateModel(mesh, envMap)
    } else {
      el.addEventListener(
        'model-loaded',
        (e) => {
          this.updateModel(e.detail.model, envMap)
        }
      )
    }
  },

  // ///////////////////////////////////
  // Usage Notes:
  // - Use nodeNames to apply the cubemap to specific nodes in the model
  // - The same material of the GLTF may be shared across multiple objects, causing all to change
  //   - Use newMaterial to avoid this
  // ///////////////////////////////////
  updateModel (model, envMap) {
    const { nodeNames, materialNames, newMaterial } = this.data

    const newMaterialCheck = (node, material) => {
      // Create new materials
      if (newMaterial) {
        const newMaterial = material.clone()
        newMaterial.envMap = envMap
        newMaterial.needsUpdate = true
        node.material = newMaterial
      // Use existing materials
      } else {
        material.envMap = envMap
        material.needsUpdate = true
      }
      // Warn about non-metal materials
      if (!material.metalness) {
        console.warn('cubemap-realtime: Material metalness is 0 or does not exist, envMap may have no effect!')
      }
    }

    const updateMaterials = (node) => {
      const meshMaterials = ensureMaterialArray(node.material)
      meshMaterials.forEach((material) => {
        // Skip if material type does not support envMaps
        if (material && !('envMap' in material)) {
          console.log(material.name, 'does not support envMaps')
          return
        }
        // console.log(material)
        // Apply to all materials
        if (!materialNames) {
          newMaterialCheck(node, material)
          return
        }
        // Apply to specific materials
        if (materialNames.includes(material.name)) {
          // console.log(material.name, material)
          newMaterialCheck(node, material)
        }
      })
    }

    model.traverse((node) => {
      // Skip if node is not a mesh
      if (!node.isMesh) return
      // console.log(node.name)
      // Target every node
      if (!nodeNames) {
        updateMaterials(node)
        return
      }
      // Target specific nodes
      if (nodeNames.includes(node.name)) {
        // console.log(node.name, node)
        // console.log(nodeNames)
        updateMaterials(node)
      }
    })
  }
}
export { CubeMapRealtime }
