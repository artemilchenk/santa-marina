<template>
  <a-scene
    class="empty-scene"
    embedded
    device-orientation-permission-ui="enabled: false"
    xr-mode-ui="enabled: false"
    vr-mode-ui="enabled: false"
    ar-mode-ui="enabled: false"
  >
    <a-entity
      position="0 0 0"
      rotation="0 180 0"
    >
      <a-camera :id="cameraId" />
    </a-entity>
  </a-scene>
</template>

<script setup lang="ts">
  interface IProps {
    cameraId: string;
  }

  const { cameraId } = defineProps<IProps>();
</script>

<style scoped lang="scss">
  .empty-scene {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1000;
  }
</style>
