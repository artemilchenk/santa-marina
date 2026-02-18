<template>
  <div class="start-screen">
    <VideoBackground
      :path="video"
      :poster="poster"
    />

    <ScreenStartContent />
  </div>
</template>

<script setup lang="ts">
  import video from 'assets/videos/landing-background.mp4';
  import poster from 'assets/images/landing-placeholder.png';
  import VideoBackground from '~/components/ui/video-background.vue';
  import ScreenStartContent from '~/components/start-screen/screen-start-content.vue';
  const assetsStore = useAssetsStore();

  onMounted(() => {
    assetsStore.preloadSkyboxVideos();
  });
</script>

<style scoped lang="scss">
  .start-screen {
    @include flexBox(column, flex-end, center);
    color: $c-white;
    font-family: 'GothamBook', sans-serif;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
