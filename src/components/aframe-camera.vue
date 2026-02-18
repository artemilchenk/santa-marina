<template>
  <a-entity
    rotation="0 0 0"
    :rotate-manipulation="`
        globalContainerId: #mtx-displacement-switcher;
        targetId: #${activePortalId};
        backButtonId: #back-button;
        exitPortalId:${exitPortalId};
        isResetRotationToggle:${isShouldResetCameraToggle};
        isShouldTargetCameraToggle:${isShouldTargetCameraToggle};
        isArrowBackVisible:${isArrowBackVisible};
        isAnimationWithZoom:${isAnimationWithZoom};
        isTargetXAxisOnly:${isTargetXAxisOnly};
      `"
  >
    <a-camera
      ref="cameraRef"
      rotation="0 0 0"
      :look-controls="`
          enabled: ${!isLookControlsDisabled};
          touchEnabled: ${!isLookControlsDisabled};
          magicWindowTrackingEnabled: ${hasGyroscopeAccess}`"
      wasd-controls-enabled="false"
      raycaster="objects: .clickable"
      cursor="fuse: false; rayOrigin: mouse;"
    />
  </a-entity>
</template>

<script setup lang="ts">
  import type { Camera } from 'three';
  import type { Entity } from 'aframe';
  import type { MtxLogger } from '~/services/mtx-logger';

  interface IProps {
    activePortalId: string;
    exitPortalId: string;
    isShouldResetCameraToggle: boolean;
    isShouldTargetCameraToggle: boolean;
    isArrowBackVisible: boolean;
    isAnimationWithZoom: boolean;
    isTargetXAxisOnly: boolean;
    isLookControlsDisabled: boolean;
    hasGyroscopeAccess: boolean;
  }

  const {
    activePortalId,
    exitPortalId,
    isShouldResetCameraToggle,
    isShouldTargetCameraToggle,
    isArrowBackVisible,
    isAnimationWithZoom,
    isTargetXAxisOnly,
    isLookControlsDisabled,
    hasGyroscopeAccess
  } = defineProps<IProps>();

  const mtxLogger = inject<MtxLogger>('mtxLogger');
  const cameraRef = ref<Entity<Camera>>();

  watch(cameraRef, () => {
    mtxLogger?.startSessionOrChangeScene(cameraRef.value);
  });
</script>
