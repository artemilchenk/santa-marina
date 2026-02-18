import { useTransitionStore } from '~/stores/transition-store';
import { useAframeStore } from '~/stores/aframe-store';
import * as THREE from 'three';

export const RotateManipulation = {
  schema: {
    isResetRotationToggle: { type: 'boolean', default: false },
    isShouldTargetCameraToggle: { type: 'boolean', default: false },
    isArrowBackVisible: { type: 'boolean', default: false },
    isAnimationWithZoom: { type: 'boolean', default: false },
    isTargetXAxisOnly: { type: 'boolean', default: false },
    targetId: { type: 'selector', default: '#followMe' },
    exitPortalId: { type: 'selector', default: '#exit-portal' },
    globalContainerId: { type: 'selector', default: '#mtx-displacement-switcher' },
    backButtonId: { type: 'selector', default: '#back-button' }
  },

  init() {
    this.aframeStore = useAframeStore();
    this.transitionStore = useTransitionStore();
    this.camera = null;
    this.cameraRotation = new THREE.Euler(0, 0, 0, 'YXZ');

    this.targetId = null;
    this.globalContainerId = null;
    this.exitPortalId = null;
    this.backButtonId = null;
    this.targetRotatePosition = null;
    this.previousCameraRotatePosition = new THREE.Vector3();

    this.isShouldTarget = false;
    this.isArrowBackVisible = false;
    this.isTargetXAxisOnly = false;

    if (!this.el) return;

    this.wrapperElement3D = this.el.object3D;

    if (!this.wrapperElement3D) return;

    const camera = this.wrapperElement3D.children[0];

    if (!camera) return;

    this.camera = camera;
  },

  tick() {
    this.updateCameraRotation();

    this.animateRotationTo();
    this.animateBackButton();
  },

  update(oldData) {
    this.targetId = this.data.targetId || null;
    this.globalContainerId = this.data.globalContainerId || null;
    this.backButtonId = this.data.backButtonId || null;
    this.exitPortalId = this.data.exitPortalId || null;
    this.isAnimationWithZoom = this.data.isAnimationWithZoom || false;
    this.isTargetXAxisOnly = this.data.isTargetXAxisOnly || false;

    if (oldData.isResetRotationToggle !== this.data.isResetRotationToggle) {
      this.updateCameraRotation();
      this.resetRotation();
    }

    if (!!oldData.isShouldTargetCameraToggle !== !!this.data.isShouldTargetCameraToggle) {
      this.isShouldTarget = true;
    }

    this.isArrowBackVisible = this.data.isArrowBackVisible;
  },

  updateCameraRotation() {
    if (!this.camera) return;

    this.cameraRotation.setFromQuaternion(this.camera.getWorldQuaternion(new THREE.Quaternion()), 'YXZ');
  },

  resetRotation() {
    const { el, camera, wrapperElement3D } = this;

    if (!el || !camera || !wrapperElement3D) return;

    const rotationYRadians = camera.rotation.y * -1;

    wrapperElement3D.rotation.set(0, rotationYRadians, 0, 'YXZ');
  },

  animateRotationTo() {
    if (
      !this.transitionStore ||
      !this.transitionStore.isInProgress ||
      this.transitionStore.duration === 0 ||
      !this.isShouldTarget
    ) {
      this.targetRotatePosition = null;

      return;
    }

    const { el, camera, wrapperElement3D } = this;

    if (!el || !camera || !wrapperElement3D) return;

    if (!this.targetRotatePosition) {
      this.animationEnd = false;

      const calculateValues = this.calculateTargetRotatePosition(this.isTargetXAxisOnly);

      if (!calculateValues) return;

      const { previousCameraRotatePosition, targetRotatePosition, targetPosition } = calculateValues;

      this.previousCameraRotatePosition = previousCameraRotatePosition;
      this.targetRotatePosition = targetRotatePosition;
      this.targetPosition = targetPosition;
    }

    const progressPercent = this.transitionStore.isReversed
      ? 1 - this.transitionStore.progress
      : this.transitionStore.progress;
    const progress = progressPercent * 1.1 >= 1 ? 1 : progressPercent * 1.1;

    if (this.animationEnd) {
      this.isShouldTarget = false;

      camera.el.setAttribute('zoom', '1');

      return;
    }

    const currentCameraRotatePosition = this.previousCameraRotatePosition
      .clone()
      .add(this.targetRotatePosition.clone().sub(this.previousCameraRotatePosition).multiplyScalar(progress));

    wrapperElement3D.lookAt(currentCameraRotatePosition);

    const directionWrapper = new THREE.Vector3();
    const lookAtPointWrapper = new THREE.Vector3();

    wrapperElement3D.getWorldDirection(directionWrapper);
    lookAtPointWrapper
      .copy(wrapperElement3D.getWorldPosition(new THREE.Vector3()))
      .add(directionWrapper.multiplyScalar(this.targetPosition.z));

    if (this.isAnimationWithZoom) {
      camera.el.setAttribute('zoom', `${1 + 1 * progress}`);
    }

    if (progress >= 1) {
      this.animationEnd = true;
    }
  },

  animateBackButton() {
    const { exitPortalId, globalContainerId, backButtonId, camera } = this;

    if (!exitPortalId || !camera || !backButtonId || !globalContainerId) return;

    const mesh = exitPortalId.getObject3D('mesh');
    const globalContainerMesh = globalContainerId.object3D;

    if (!mesh || !globalContainerMesh) return;

    const meshPosition = new THREE.Vector3(0, 0, 0);
    const globalContainerMeshPosition = new THREE.Vector3(0, 0, 0);

    mesh.getWorldPosition(meshPosition);
    globalContainerMesh.getWorldPosition(globalContainerMeshPosition);

    const relativePosition = meshPosition.clone().sub(globalContainerMeshPosition);

    const targetPosition = relativePosition.clone().multiplyScalar(-1);

    const frustum = new THREE.Frustum();

    frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        this.el.sceneEl.camera.projectionMatrix,
        this.el.sceneEl.camera.matrixWorldInverse
      )
    );

    const isOnScreen = frustum.containsPoint(meshPosition);
    this.aframeStore.setIsBackPortalOnScreen(isOnScreen);

    if (!this.isArrowBackVisible) return;

    const directionCamera = new THREE.Vector3();

    camera.getWorldDirection(directionCamera);

    const orientation = targetPosition.normalize().cross(directionCamera.normalize()).y;
    backButtonId.style.pointerEvents = `${isOnScreen ? 'none' : 'all'}`;
    backButtonId.style.opacity = `${isOnScreen ? 0 : 1}`;
    backButtonId.style.left = `${orientation < 0 ? 0 : 100}%`;
    backButtonId.style.transform = `translate(${orientation < 0 ? 0 : -100}%) rotate(${
      orientation < 0 ? '180deg' : '0deg'
    })`;
  },

  calculateTargetRotatePosition(isTargetXAxisOnly = false) {
    const { camera, wrapperElement3D, targetId } = this;

    if (!targetId) return;

    const mesh = targetId.getObject3D('mesh');

    if (!mesh) return;

    const camPosition = camera.getWorldPosition(new THREE.Vector3());
    const meshPosition = mesh.getWorldPosition(new THREE.Vector3());
    const targetPosition = meshPosition.clone().multiplyScalar(-1);

    const distance = camPosition.distanceTo(meshPosition.clone().setY(camPosition.y));

    const camDirection = camera.getWorldDirection(new THREE.Vector3());
    const camLookAtPoint = camPosition.clone().add(camDirection.multiplyScalar(distance));

    const wrapDirection = wrapperElement3D.getWorldDirection(new THREE.Vector3());
    const wrapLookAtPoint = wrapperElement3D
      .getWorldPosition(new THREE.Vector3())
      .add(wrapDirection.multiplyScalar(distance));

    const angleCameraWrapper = wrapLookAtPoint.angleTo(camLookAtPoint);
    const angleFactor = angleCameraWrapper > Math.PI / 2 ? -1 : 1;

    const virtualCamera = camera.clone();

    virtualCamera.position.copy(camPosition);
    virtualCamera.lookAt(targetPosition);

    virtualCamera.rotation.set(
      virtualCamera.rotation.x - camera.rotation.x * angleFactor,
      virtualCamera.rotation.y - camera.rotation.y,
      virtualCamera.rotation.z - camera.rotation.z * angleFactor
    );

    const directionVirtualCamera = virtualCamera.getWorldDirection(new THREE.Vector3());
    const lookAtPointVirtualCamera = virtualCamera
      .getWorldPosition(new THREE.Vector3())
      .add(directionVirtualCamera.multiplyScalar(distance));

    const targetRotatePosition = isTargetXAxisOnly
      ? new THREE.Vector3(lookAtPointVirtualCamera.x, wrapLookAtPoint.y, lookAtPointVirtualCamera.z)
      : lookAtPointVirtualCamera.clone();
    const previousCameraRotatePosition = wrapLookAtPoint.clone();

    return { previousCameraRotatePosition, targetRotatePosition, targetPosition };
  }
};
