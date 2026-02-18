export const MaxAnisotropy = {
  init() {
    this.el.addEventListener('loaded', () => {
      requestAnimationFrame(() => {
        const texture = this.el.getObject3D('mesh').material.map;

        if (texture) {
          texture.anisotropy = this.el.sceneEl.renderer.capabilities.getMaxAnisotropy();
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.format = THREE.RGBFormat;
          texture.needsUpdate = true;
        }
      });
    });
  }
};
