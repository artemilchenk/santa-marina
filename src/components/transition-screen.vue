<template>
  <div
    v-show="progress && isTransitionScreenVisible"
    ref="elementRef"
    :class="$style.transition_screen"
  />
</template>

<script setup lang="ts">
  import { TRANSITION_SCREEN_DISSAPEAR_DELAY } from '~/constants/transition';

  const transitionStore = useTransitionStore();
  const { progress, isInProgress, isReversed, isTransitionScreenVisible } = storeToRefs(transitionStore);

  const elementRef = ref<HTMLDivElement | null>(null);
  const isShouldPlayReverse = ref(false);

  const reverseTransitionHandler = () => {
    transitionStore.play({
      isReversed: true,
      onFinished: () => {
        transitionStore.setIsTransitionScreenVisible(false);
      }
    });
    isShouldPlayReverse.value = false;
  };

  const { start: startReverse } = useTimeout(TRANSITION_SCREEN_DISSAPEAR_DELAY, {
    controls: true,
    immediate: false,
    callback: reverseTransitionHandler
  });

  watchEffect(() => {
    const element = elementRef.value;
    if (!element) {
      return;
    }

    if (progress.value === 1 && !isInProgress.value && !isReversed.value) {
      startReverse();
    }

    element.style.opacity = `${progress.value}`;
  });
</script>

<style module lang="scss">
  .transition_screen {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;

    width: 100%;
    height: 100%;

    background-color: $c-white;
  }
</style>
