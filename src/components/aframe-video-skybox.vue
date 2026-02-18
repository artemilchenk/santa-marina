<template>
  <a-sky
    v-for="skybox in skyboxImages"
    :key="skybox[0]"
    :src="`#${skybox[0]}`"
    :visible="skybox[0] === `skybox-image-${screenName}`"
    :rotation="skybox[2] || '0 0 0'"
    radius="110"
  />

  <template v-if="renderedVideos.length !== 0">
    <a-videosphere
      v-for="skybox in renderedVideos"
      :key="skybox[0]"
      :src="`#${skybox[0]}`"
      :rotation="skybox[2] || '0 0 0'"
      :play-skybox-video="`videoSrcId: ${skybox[0]}; isActive: ${skybox[0] === screenName}`"
      :radius="skybox[0] === screenName ? '100' : '1000'"
      loop
      muted
      autoplay
    />
  </template>
</template>

<script setup lang="ts">
  import { AFRAME_VIDEOSPHERE_APPEARING_DELAY } from '~/constants/common';
  import type { EScreenName } from '~/types/screen';

  interface IProps {
    skyboxImages: string[][];
    skyboxVideos: string[][];
    screenName: EScreenName;
  }

  const props = defineProps<IProps>();
  const { skyboxImages, skyboxVideos, screenName } = toRefs(props);

  const timer = ref<NodeJS.Timeout | null>(null);
  const renderedVideos = ref<string[][]>([]);

  watch(skyboxVideos, (value) => {
    if (value.length === 0) {
      return;
    }

    if (timer.value) {
      clearTimeout(timer.value);
    }

    setTimeout(() => {
      renderedVideos.value = value;
    }, AFRAME_VIDEOSPHERE_APPEARING_DELAY);
  }, { immediate: true });

  onUnmounted(() => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
  });
</script>
