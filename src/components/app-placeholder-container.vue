<script setup lang="ts">
  import DesktopPlaceholderComponent from '~/components/desktop-placeholder/desktop-placeholder-component.vue';
  import RotatePlaceholderComponent from '~/components/rotate-placeholder-component.vue';
  import { isMobile } from '~/utils/context';
</script>

<template>
  <div class="place-holder">
    <RotatePlaceholderComponent v-if="isMobile" />
    <DesktopPlaceholderComponent v-else />
  </div>
</template>

<style scoped lang="scss">
  .place-holder {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
