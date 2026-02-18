<script setup lang="ts">
  import { AFRAME_PROMPT_APPEARING_DELAY } from '~/constants/common';

  const appStore = useAppStore();
  const aframeStore = useAframeStore();
  const { isInstructionViewed } = storeToRefs(appStore);
  const { activeSceneData, isBackPortalOnScreen } = storeToRefs(aframeStore);

  const isPromptVisible = ref<boolean>(false);
  const isShouldRendering = ref<boolean>(false);

  const isCheckedHotspot = computed(() => {
    return activeSceneData.value?.data.hotspots.find((hotspot) => hotspot.isChecked);
  });

  const timer = ref<NodeJS.Timeout | null>(null);
  const timerRendering = ref<NodeJS.Timeout | null>(null);

  watchEffect(() => {
    isPromptVisible.value = false;

    if (timer.value) {
      clearTimeout(timer.value);
    }

    if (activeSceneData.value?.data.hotspots.length && !isCheckedHotspot.value) {
      timer.value = setTimeout(() => {
        isPromptVisible.value = true;
      }, 2000);
    }
  });

  watchEffect(() => {
    if (!isInstructionViewed.value) {
      return;
    }

    timerRendering.value = setTimeout(() => {
      isShouldRendering.value = true;
    }, AFRAME_PROMPT_APPEARING_DELAY);
  });

  onUnmounted(() => {
    if (timer.value) {
      clearTimeout(timer.value);
    }

    if (timerRendering.value) {
      clearTimeout(timerRendering.value);
    }
  });
</script>

<template>
  <div
    v-if="isShouldRendering"
    :class="{ 'is-visible': isPromptVisible && !isBackPortalOnScreen }"
    class="hotspot-prompt"
  >
    <p class="hotspot-prompt__text">
      Tap on hotspots to interact
    </p>
  </div>
</template>

<style scoped lang="scss">
  .hotspot-prompt {
    width: max-content;

    transition: opacity 0.5s ease;
    opacity: 0;

    &.is-visible {
      opacity: 1;
    }

    &__text {
      @include text('GothamBold', 18px, 700, 100%);

      --shadow-blur: 8px;
      width: max-content;

      text-align: center;
      text-shadow:
        0px -4px var(--shadow-blur) $c-white,
        0px 4px var(--shadow-blur) $c-white,
        -8px 0px var(--shadow-blur) $c-white,
        8px 0px var(--shadow-blur) $c-white;

      color: $c-dark-green;
    }
  }
</style>
