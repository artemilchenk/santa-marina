<template>
  <NuxtPage />

  <Landscape />

  <AframeEmptyScene camera-id="placeholder-camera" />
</template>

<script setup lang="ts">
  import Landscape from '~/components/landscape.vue';
  import { SoundService } from '~/services/sound-service';
  import { AFRAME_SCENES } from '~/mocks/aframe-scene';
  import { type AmbienceSound, ESoundType } from '~/types/sound';
  import { EFFECT_SOUNDS } from '~/mocks/sounds';
  import type { Entity } from 'aframe';
  import type { Camera } from 'three';
  import { MtxLogger } from '~/services/mtx-logger';

  const runtimeConfig = useRuntimeConfig();
  const appStore = useAppStore();
  const route = useRoute();
  const soundService = new SoundService();
  const mtxLogger = new MtxLogger(runtimeConfig.public.isProductionEnv);

  const { debug, windowFocused, muted } = storeToRefs(appStore);

  const attachListeners = () => {
    window.addEventListener('resize', handleResize);
    window.matchMedia('(orientation: portrait)').addEventListener('change', onOrientationChange);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
  };

  const detachListeners = () => {
    window.removeEventListener('resize', handleResize);
    window.matchMedia('(orientation: portrait)').removeEventListener('change', onOrientationChange);
    window.removeEventListener('blur', onBlur);
    window.removeEventListener('focus', onFocus);
  };

  const handleResize = () => {
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
  };

  const onOrientationChange = (e: MediaQueryListEvent) => {
    appStore.setIsLandscape(!e.matches);
  };

  const checkQueryParams = () => {
    const query = route.query;

    if (query.debug === 'true') {
      appStore.setDebug(true);
    }
  };

  const onBlur = () => {
    appStore.setWindowFocused(false);
  };

  const onFocus = () => {
    appStore.setWindowFocused(true);
  };

  const preloadSounds = () => {
    const ambientSounds = AFRAME_SCENES.map(
      (scene): AmbienceSound => ({
        id: scene.name,
        src: scene.data.skybox.audio.src,
        type: ESoundType.ambience,
        loop: scene.data.skybox.audio.loop
      })
    );

    soundService.preloadSounds([...EFFECT_SOUNDS, ...ambientSounds]);
  };

  const initMetalitix = () => {
    const camera = document.getElementById('placeholder-camera');

    if (!camera) return;

    mtxLogger.startSessionOrChangeScene(camera as Entity<Camera>);
  };

  onMounted(async () => {
    checkQueryParams();
    attachListeners();
    handleResize();
    initMetalitix();
    preloadSounds();
  });

  watch(debug, (value) => {
    mtxLogger.toggleDebugMode(value);
  });

  watch(windowFocused, (value) => {
    if (value) {
      soundService.resume();
    } else {
      soundService.stop();
    }
  });

  watch(muted, (value) => {
    soundService.mute(value);
  });

  onBeforeUnmount(() => {
    soundService.stop();
    detachListeners();
  });

  provide('soundService', soundService);
  provide('mtxLogger', mtxLogger);
</script>
