export const EmbededHTML = {
  schema: {
    isVisible: {
      type: 'boolean',
      deafult: false
    },
    innerHTMLClassname: {
      type: 'string',
      deafult: ''
    }
  },

  init () {
    this.isOnScreen = false;

    this.mesh = this.el.getObject3D('mesh');
    this.tmpV = new THREE.Vector3(0, 0, 0);

    this.setInnerHTMLElement();
  },

  tick() {
    // check is mesh on the screen
    this.checkIsObjectOnScreen();

    if (this.innerHTMLElement) {
      if (this.isOnScreen) {
        this.innerHTMLElement.classList.remove('hidden');
      } else {
        this.innerHTMLElement.classList.add('hidden');
      }
    }

    // transform html element
    this.transformHTMLElement();
  },

  update(oldData) {
    if (!this.data.isVisible) {
      return;
    }

    this.setInnerHTMLElement();
  },

  setInnerHTMLElement() {
    const innerHTMLClassname = this.data.innerHTMLClassname;
    if (!innerHTMLClassname) {
      return;
    }

    const innerHTMLElement = this.el.querySelector(`.${innerHTMLClassname}`);

    if (!innerHTMLElement) {
      return;
    }

    this.innerHTMLElement = innerHTMLElement;
  },

  checkIsObjectOnScreen() {
    const object3D = this.el.object3D;
    const camera = this.el.sceneEl.camera;

    if (!object3D || !camera) {
      return;
    }

    const objectPosition = object3D.position;
    const frustum = new THREE.Frustum();
    frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,
      camera.matrixWorldInverse));

    this.isOnScreen = frustum.containsPoint(objectPosition);
  },

  transformHTMLElement() {
    if (!this.mesh || !this.innerHTMLElement || !this.isOnScreen) {
      return;
    }

    const tmpV = this.tmpV;
    const canvas = this.el.sceneEl.canvas;
    const camera = this.el.sceneEl.camera;

    // transform html element
    // get the world position
    this.mesh.getWorldPosition(tmpV);
    // get the normalized screen coordinate of that position
    tmpV.project(camera);
    // convert the normalized position to CSS coordinates
    const x = (tmpV.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (tmpV.y * -0.5 + 0.5) * canvas.clientHeight;

    // move the elem to that position
    this.innerHTMLElement.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
  }
};
