<script setup lang="ts">
  import { type IHotspotContentVideo } from '~/types/hotspot';
  import { usePreloadMedia } from '~/composables/usePreloadMedia';
  import closeIcon from 'assets/icons/video-close-icon.svg';
  import PreloaderSpinner from '~/components/preloader/components/preloader-spinner.vue';
  import type { SoundService } from '~/services/sound-service';
  import { ESoundType } from '~/types/sound';
  import { HOTSPOT_MEDIA_CONTROLS_APPEARING_DELAY } from '~/constants/common';

  type Props = {
    onCloseAction: () => void;
    content: IHotspotContentVideo;
  };

  const props = defineProps<Props>();
  const appStore = useAppStore();
  const soundService = inject<SoundService>('soundService');

  const { content, onCloseAction: onCloseActionProp } = toRefs(props);
  const { screenName, windowFocused } = storeToRefs(appStore);

  const { loadMediaRequest, mediaSrc, isMediaLoading, isMediaLoaded, loadErrorText } = usePreloadMedia();

  const videoElementRef = ref<HTMLVideoElement | null>(null);
  const isVideoMuted = ref<boolean>(true);
  const isVideoPaused = ref<boolean>(false);
  const isFirstVolumeChange = ref<boolean>(true);
  const isFullScreen = ref<boolean>(false);
  const isMediaLoadedDelayEnds = ref<boolean>(false);
  const mediaLoadedDelayTimer = ref<NodeJS.Timeout | null>(null);

  const onPlay = () => {
    isVideoPaused.value = false;

    if (!videoElementRef.value ||
      !isMediaLoaded.value ||
      !soundService ||
      videoElementRef.value.muted) {
      return;
    }

    soundService.stop(ESoundType.ambience);
  };

  const onPause = () => {
    isVideoPaused.value = true;

    if (!videoElementRef.value || !isMediaLoaded.value) {
      return;
    }

    if (!soundService ||
      !videoElementRef.value.muted ||
      !windowFocused.value) {
      return;
    }

    soundService.play(screenName.value);
  };

  const onVolumeChange = () => {
    if (isFirstVolumeChange.value) {
      isFirstVolumeChange.value = false;
      return;
    }

    if (!videoElementRef.value ||
      !isMediaLoaded.value ||
      !soundService ||
      !windowFocused.value ||
      videoElementRef.value.paused) {
      return;
    }

    if (videoElementRef.value.muted) {
      soundService.play(screenName.value);
      return;
    }

    soundService.stop(ESoundType.ambience);
  };

  const onOpenFullscreenClick = async () => {
    if (!videoElementRef.value || !isMediaLoaded.value) {
      return;
    }

    if (!isFullScreen.value) {
      isVideoMuted.value = false;
      videoElementRef.value.muted = false;
    }

    isFullScreen.value = !isFullScreen.value;
  };

  const onButtonPlayClick = () => {
    if (!videoElementRef.value || !isMediaLoaded.value) {
      return;
    }
    videoElementRef.value.play();
  };

  const onButtonMuteClick = () => {
    if (!videoElementRef.value || !isMediaLoaded.value) {
      return;
    }

    isVideoMuted.value = !isVideoMuted.value;
    videoElementRef.value.muted = isVideoMuted.value;
  };

  const onModalCloseAction = () => {
    if (soundService) {
      soundService.play(screenName.value);
    }

    if (onCloseActionProp.value) {
      onCloseActionProp.value();
    }
  };

  watchEffect(async () => {
    if (!content.value) return;
    await loadMediaRequest(content.value.data.video, 'video');
  });

  watchEffect(() => {
    if (!videoElementRef.value || !isMediaLoaded.value) {
      return;
    }

    videoElementRef.value.play();
  });

  watchEffect(() => {
    if (!videoElementRef.value || !isMediaLoaded.value) {
      return;
    }

    if (!windowFocused.value) {
      videoElementRef.value.pause();
      return;
    }

    if (videoElementRef.value.paused) {
      videoElementRef.value.muted = true;
      isVideoMuted.value = true;
      videoElementRef.value.play();
    }
  });

  watchEffect(() => {
    if (!isMediaLoaded.value) {
      return;
    }

    if (mediaLoadedDelayTimer.value) {
      clearTimeout(mediaLoadedDelayTimer.value);
    }

    mediaLoadedDelayTimer.value = setTimeout(() => {
      isMediaLoadedDelayEnds.value = true;
    }, HOTSPOT_MEDIA_CONTROLS_APPEARING_DELAY);
  });

  onUnmounted(() => {
    if (mediaLoadedDelayTimer.value) {
      clearTimeout(mediaLoadedDelayTimer.value);
    }
  });
</script>

<template>
  <div
    :class="{
      'is-load-error': loadErrorText,
      'fullscreen': isFullScreen
    }"
    class="hotspot-modal-content-video"
  >
    <div
      v-if="isMediaLoading"
      class="hotspot-spinner-container"
    >
      <PreloaderSpinner class="hotspot-spinner" />
    </div>

    <div
      v-if="loadErrorText"
      class="modal-error"
    >
      {{ loadErrorText }}
    </div>

    <div
      v-if="isMediaLoaded && mediaSrc"
      class="video-container"
    >
      <video
        ref="videoElementRef"
        :muted="isVideoMuted"
        loop
        playsinline
        crossorigin="anonymous"
        preload="auto"
        @play="onPlay"
        @pause="onPause"
        @volumechange="onVolumeChange"
      >
        <source
          type="video/mp4"
          :src="mediaSrc"
        >
      </video>

      <div
        v-if="isMediaLoadedDelayEnds"
        class="video-controls"
      >
        <button
          class="video-controls__button fullscreen"
          @click="onOpenFullscreenClick"
        />

        <button
          class="video-controls__button play"
          :class="!isVideoPaused && 'hidden'"
          @click="onButtonPlayClick"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.5 14.134C27.1667 14.5189 27.1667 15.4811 26.5 15.866L7 27.1244C6.33333 27.5093 5.5 27.0281 5.5 26.2583L5.5 3.74167C5.5 2.97187 6.33333 2.49074 7 2.87564L26.5 14.134Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <button
          class="video-controls__mute"
          @click="onButtonMuteClick"
        >
          <svg
            class="icon"
            width="24"
            height="20"
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              v-if="!isVideoMuted"
              d="M13.2838 0.124144C13.7912 0.356284 14.1176 0.865206 14.1176 1.4277V18.5703C14.1176 19.1328 13.7912 19.6417 13.2838 19.8739C12.7765 20.106 12.1809 20.0123 11.7662 19.6373L5.81471 14.2847H2.82353C1.26618 14.2847 0 13.0034 0 11.4276V8.57046C0 6.99459 1.26618 5.71336 2.82353 5.71336H5.81471L11.7662 0.360748C12.1809 -0.0142472 12.7765 -0.103532 13.2838 0.124144ZM20.8721 3.34732C22.7779 4.91872 24 7.31601 24 9.99901C24 12.682 22.7779 15.0793 20.8721 16.6507C20.4176 17.0257 19.7515 16.9543 19.3809 16.4945C19.0103 16.0347 19.0809 15.3606 19.5353 14.9856C20.9691 13.807 21.8824 12.0124 21.8824 9.99901C21.8824 7.98565 20.9691 6.19103 19.5353 5.00801C19.0809 4.63301 19.0147 3.95892 19.3809 3.4991C19.7471 3.03928 20.4176 2.97232 20.8721 3.34285V3.34732ZM18.2029 6.67317C19.1515 7.45887 19.7647 8.65528 19.7647 9.99901C19.7647 11.3427 19.1515 12.5392 18.2029 13.3249C17.7485 13.6999 17.0824 13.6284 16.7118 13.1686C16.3412 12.7088 16.4118 12.0347 16.8662 11.6597C17.3426 11.2669 17.6471 10.6686 17.6471 9.99901C17.6471 9.32938 17.3426 8.73117 16.8662 8.33386C16.4118 7.95886 16.3456 7.28476 16.7118 6.82495C17.0779 6.36513 17.7485 6.29817 18.2029 6.6687V6.67317Z"
              fill="currentColor"
            />

            <path
              v-else
              d="m13.2838,0.22218c0.5074,0.23214 0.8338,0.74107 0.8338,1.30356l0,17.1426c0,0.5625 -0.3264,1.0714 -0.8338,1.3036c-0.5073,0.2321 -1.1029,0.1384 -1.5176,-0.2366l-5.95149,-5.3526l-2.99118,0c-1.55735,0 -2.82353,-1.2813 -2.82353,-2.8571l0,-2.85714c0,-1.57587 1.26618,-2.8571 2.82353,-2.8571l2.99118,0l5.95149,-5.35261c0.4147,-0.375 1.0103,-0.46428 1.5176,-0.23661z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>

    <button
      v-if="!isMediaLoading"
      :class="isFullScreen && 'hidden'"
      class="hotspot-modal-content-video__close"
      @click="onModalCloseAction"
    >
      <img
        :src="closeIcon"
        alt="CLoseIcon"
      >
    </button>
  </div>
</template>

<style scoped lang="scss">
  .hotspot-modal-content-video {
    @include flexBox(column, center, center);
    position: relative;
    min-height: 100px;

    width: 80%;
    max-width: 335px;

    &.fullscreen {
      max-width: unset;
      width: 100%;
      height: 100%;
    }

    .video-container {
      @include flexBox(column, center, center);

      position: relative;
      z-index: 0;

      border-radius: 6px;
      box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.36);
      overflow: hidden;

      video {
        position: relative;
        z-index: 0;

        width: 100%;
        height: auto;
      }
    }

    .video-controls {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      &__button {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;

        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 100%;

        color: $c-white;

        svg {
          width: 64px;
          height: auto;
        }

        &.hidden {
          display: none;
        }

        &.play {
          z-index: 2;
        }
      }

      &__mute {
        position: absolute;
        right: 18px;
        bottom: 18px;
        z-index: 4;

        display: flex;
        justify-content: center;
        align-items: center;

        width: 30px;
        height: 30px;
        border: 1px solid $c-dark-green;
        border-radius: 50%;

        color: $c-dark-green;
        background-color: $c-white;

        svg {
          width: 16px;
          height: auto;
        }
      }
    }

    &__close {
      @include flexBox(row, center, center);

      position: absolute;
      z-index: 10;
      right: 18px;
      top: 18px;
      width: 30px;
      height: 30px;
      border: 1px solid $c-dark-green;
      border-radius: 50%;

      overflow: hidden;
      transform: translateZ(0);

      &.hidden {
        display: none;
      }

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .is-load-error {
    @include flexBox(row, center, center);
    background-color: $c-white;
    color: $c-carmine-red;
    padding: 20px;
  }
</style>
