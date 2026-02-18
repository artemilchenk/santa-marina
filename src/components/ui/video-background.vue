<script setup lang="ts">
  type Props = {
    path: string;
    poster?: string;
  };

  const props = defineProps<Props>();
  const { path } = toRefs(props);

  const { loadMediaRequest, mediaSrc, isMediaLoaded } = usePreloadMedia();

  watchEffect(async () => {
    await loadMediaRequest(path.value, 'video');
  });
</script>

<template>
  <div class="video-background">
    <img
      :src="poster"
      class="video-background__poster"
      alt="background"
    >

    <video
      v-if="mediaSrc && isMediaLoaded"
      ref="videoPlayerRef"
      class="video-background__video"
      muted
      loop
      disablePictureInPicture
      playsInline
      autoPlay
      preload="auto"
    >
      <source
        :src="mediaSrc"
        type="video/mp4"
      >
    </video>
  </div>
</template>

<style scoped lang="scss">
  .video-background {
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;

    background-color: $c-dark-green;

    &__poster,
    &__video {
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__poster {
      z-index: 0;
    }

    &__video {
      z-index: 1;
    }
  }
</style>
