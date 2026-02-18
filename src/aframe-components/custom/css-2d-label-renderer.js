import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

export const CSS2DLabelRenderer = {
  schema: {
    enabled: { type: 'boolean', default: true }
  },

  init() {
    this.sceneEl = this.el;
    this.camera = this.sceneEl.camera;

    this.labelRenderer = new CSS2DRenderer();

    this.labelRenderer.domElement.id = 'labelRenderer';
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';

    this.updateSize();
    this.sceneEl.appendChild(this.labelRenderer.domElement);

    this.sceneEl.rendererCss2D = this.labelRenderer;

    window.addEventListener('resize', this.updateSize.bind(this));
  },

  tick() {
    if (!this.data.enabled) return;

    this.labelRenderer.render(this.sceneEl.object3D, this.camera);
  },

  updateSize() {
    this.labelRenderer.setSize(this.sceneEl.offsetWidth, this.sceneEl.offsetHeight);
  },

  remove() {
    if (this.labelRenderer.domElement.parentNode) {
      this.labelRenderer.domElement.parentNode.removeChild(this.labelRenderer.domElement);
    }
  }
};
