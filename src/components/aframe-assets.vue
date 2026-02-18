<template>
  <a-assets
    ref="aframeAssetsRef"
    :timeout="props.timeout"
  >
    <a-asset-item
      v-for="(model, m) in props.models"
      :id="model[0]"
      :key="m"
      :src="model[1]"
      @loaded="onAssetItemLoaded"
    />

    <img
      v-for="(image, i) in props.images"
      :id="image[0]"
      :key="i"
      :src="image[1]"
      :alt="image[0]"
      crossorigin="anonymous"
      @load="onAssetImageLoaded"
    >

    <a-cubemap
      v-for="([name, cubeImages], i) in props.cubemaps"
      :id="name"
      :key="i"
    >
      <img
        v-for="(cubeImage, j) in cubeImages"
        :key="i + '-' + j"
        :alt="`${name}-${j}`"
        :src="cubeImage"
        crossorigin="anonymous"
      >
    </a-cubemap>

    <audio
      v-for="(audio, a) in props.audios"
      :id="audio[0]"
      :key="a"
      crossorigin="anonymous"
      :src="audio[1]"
      preload="auto"
    />

    <video
      v-for="(video, v) in props.videos"
      :id="video[0]"
      :key="v"
      crossorigin="anonymous"
      :src="video[1]"
    />
  </a-assets>
</template>

<script setup lang="ts">
  import { onMounted, ref, nextTick } from 'vue';
  import type { Entity } from 'aframe';
  import AframeAssets from '~/components/aframe-assets.vue';

  const props = defineProps<{
    models?: [string, string][];
    images?: [string, string][];
    cubemaps?: [string, string[]][];
    audios?: [string, string][];
    videos?: [string, string][];
    timeout?: number;
    onLoaded?:() => void;
  }>();

  const aframeAssetsRef = ref<Entity<typeof AframeAssets> | null>(null);
  const assetsMounted = ref<boolean>(false);
  const modelsToLoad = ref<number>(props.models?.length || 0);
  const imagesToLoad = ref<number>(props.images?.length || 0);

  const onAssetItemLoaded = () => {
    modelsToLoad.value--;

    if (modelsToLoad.value <= 0 && assetsMounted.value) {
      props.onLoaded?.();
    }
  };

  const onAssetImageLoaded = () => {
    imagesToLoad.value--;

    if (imagesToLoad.value <= 0 && assetsMounted.value) {
      props.onLoaded?.();
    }
  };

  const onAssetsLoaded = () => {
    assetsMounted.value = true;

    if (modelsToLoad.value <= 0 && imagesToLoad.value <= 0) {
      props.onLoaded?.();
    }
  };

  onMounted(async () => {
    await nextTick();
    aframeAssetsRef.value?.addEventListener('loaded', onAssetsLoaded);
  });

  watch(
    () => props.models,
    (value) => {
      modelsToLoad.value = value?.length || 0;
    }
  );
</script>
