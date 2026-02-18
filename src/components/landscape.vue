<template>
  <div
    v-if="isLandscape"
    class="landscape-overlay"
  >
    <AppPlaceholderContainer />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import AppPlaceholderContainer from '~/components/app-placeholder-container.vue';

  const isLandscape = ref<boolean>(false);

  const checkOrientation = () => {
    isLandscape.value = window.innerWidth > window.innerHeight;
  };

  onMounted(() => {
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkOrientation);
  });
</script>

<style scoped lang="scss">
  .landscape-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    z-index: 9999;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @media (orientation: portrait) {
    .landscape-overlay {
      display: none;
    }
  }
</style>
