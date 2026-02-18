import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export const CSS2DLabelObject = {
  schema: {
    enabled: { type: 'boolean', default: true },
    isVisible: { type: 'boolean', default: false },
    innerHTMLClassname: { type: 'string', default: '' }
  },

  init() {
    if (this.el.hasLoaded) {
      this.createLabelObject();
    } else {
      this.el.addEventListener('loaded', this.createLabelObject.bind(this));
    }
  },

  update() {
    this.setInnerHTMLElement();

    if (!this.innerHTMLElement) return;

    if (this.labelObject) {
      this.labelObject.element = this.innerHTMLElement;
    }

    if (this.data.isVisible) {
      this.innerHTMLElement.classList.remove('hidden');
    } else {
      this.innerHTMLElement.classList.add('hidden');
    }
  },

  createLabelObject() {
    this.setInnerHTMLElement();

    this.labelObject = new CSS2DObject(this.innerHTMLElement);
    const mesh = this.el.getObject3D('mesh');

    if (mesh) {
      mesh.add(this.labelObject);
    } else {
      this.el.addEventListener('object3dset', () => {
        const updatedMesh = this.el.getObject3D('mesh');

        if (updatedMesh) {
          updatedMesh.add(this.labelObject);
        }
      });
    }
  },

  setInnerHTMLElement() {
    if (!this.data.innerHTMLClassname) return;

    const innerHTMLElement = this.el.querySelector(`.${this.data.innerHTMLClassname}`);

    if (!innerHTMLElement) return;

    this.innerHTMLElement?.remove();

    this.innerHTMLElement = innerHTMLElement;
  },

  remove() {
    this.labelObject?.removeFromParent();
    this.labelObject?.clear();
  }
};
