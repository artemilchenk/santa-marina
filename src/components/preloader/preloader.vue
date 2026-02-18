<template>
  <div :class="$style.preloader">
    <PreloaderSpinner :class="$style.spinner" />
  </div>
</template>

<script setup lang="ts">
  import PreloaderSpinner from './components/preloader-spinner.vue';
</script>

<style module lang="scss">
.preloader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  color: $c-avocado;
  background-color: $c-white;
}

.spinner {
  color: inherit;
}
</style>
