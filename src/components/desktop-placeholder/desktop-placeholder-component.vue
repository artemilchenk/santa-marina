<script setup lang="ts">
  import video from 'assets/videos/desktop-ph-background.mp4';
  import poster from 'assets/images/landscape-placeholder.jpg';
  import VideoBackground from '~/components/ui/video-background.vue';
  import PlaceholderContent from '~/components/desktop-placeholder/placeholder-content.vue';
</script>

<template>
  <div class="place-holder-container">
    <VideoBackground
      :path="video"
      :poster="poster"
    />
    <PlaceholderContent />
  </div>
</template>

<style scoped lang="scss"></style>
