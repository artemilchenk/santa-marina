<script setup lang="ts">
  import { EHotspotContentMediaType, type IHotspotContentCommon } from '~/types/hotspot';
  import PreloaderSpinner from '~/components/preloader/components/preloader-spinner.vue';
  import { usePreloadMedia } from '~/composables/usePreloadMedia';
  import type { SoundService } from '~/services/sound-service';
  import { ESoundType } from '~/types/sound';
  import { HOTSPOT_MEDIA_CONTROLS_APPEARING_DELAY } from '~/constants/common';

  type Props = {
    onCloseAction: () => void;
    content: IHotspotContentCommon;
  };

  const props = defineProps<Props>();
  const appStore = useAppStore();
  const soundService = inject<SoundService>('soundService');

  const { content } = toRefs(props);
  const { screenName, windowFocused } = storeToRefs(appStore);

  const { loadMediaRequest, mediaSrc, isMediaLoading, isMediaLoaded, loadErrorText } = usePreloadMedia();

  const descriptionRef = ref<HTMLDivElement | null>(null);
  const videoElementRef = ref<HTMLVideoElement | null>(null);
  const isLongText = ref<boolean>(false);
  const isVideoMuted = ref<boolean>(true);
  const isVideoPaused = ref<boolean>(false);
  const isFirstVolumeChange = ref<boolean>(true);
  const isFullScreen = ref<boolean>(false);
  const isMediaLoadedDelayEnds = ref<boolean>(false);
  const mediaLoadedDelayTimer = ref<NodeJS.Timeout | null>(null);

  const contentMedia = computed(() => {
    return content.value ? content.value.data.media : null;
  });

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
    if (!videoElementRef.value || !isMediaLoaded.value) {
      return;
    }

    if (videoElementRef.value.paused) {
      isVideoPaused.value = true;
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

  const onFullScreen = (isFullscreenProp: boolean | undefined = undefined) => {
    if (!videoElementRef.value || !isMediaLoaded.value) {
      return;
    }

    if (typeof isFullscreenProp === 'undefined') {
      const isFullscreenNow = document.fullscreenElement !== null;

      videoElementRef.value.muted = !isFullscreenNow;
      isVideoMuted.value = !isFullscreenNow;
      isFullScreen.value = isFullscreenNow;

      return;
    }

    videoElementRef.value.muted = !isFullscreenProp;
    isVideoMuted.value = !isFullscreenProp;
    isFullScreen.value = isFullscreenProp;
  };

  const onOpenFullscreenClick = async () => {
    if (!videoElementRef.value || !isMediaLoaded.value) {
      return;
    }

    // @ts-ignore: Unreachable code error
    const isSafari = typeof videoElementRef.value.webkitExitFullscreen === 'function' || false;

    try {
      if (!isFullScreen.value) {
        if (isSafari) {
          // @ts-ignore: Unreachable code error
          videoElementRef.value.webkitEnterFullscreen();
        } else {
          await videoElementRef.value.requestFullscreen();
        }
        return;
      }

      if (isSafari) {
        // @ts-ignore: Unreachable code error
        videoElementRef.value.webkitExitFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch (error) {
      console.error('Error in fullscreen methods', error);
    }
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

  watchEffect(async () => {
    if (!contentMedia.value) return;

    const contentType = contentMedia.value.type === EHotspotContentMediaType.VIDEO ? 'video' : 'image';
    await loadMediaRequest(contentMedia.value.src, contentType);
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

  onMounted(() => {
    if (descriptionRef.value && descriptionRef.value?.clientHeight >= 240) {
      isLongText.value = true;
    }

    if (mediaLoadedDelayTimer.value) {
      clearTimeout(mediaLoadedDelayTimer.value);
    }
  });
</script>

<template>
  <div
    v-if="content"
    class="hotspot-modal-content-common"
  >
    <div class="media-container">
      <PreloaderSpinner
        v-if="isMediaLoading"
        class="hotspot-spinner"
      />

      <div
        v-if="loadErrorText"
        class="modal-error"
      >
        {{ loadErrorText }}
      </div>

      <template v-if="isMediaLoaded && mediaSrc">
        <img
          v-if="contentMedia?.type === EHotspotContentMediaType.IMAGE"
          :src="mediaSrc"
          :alt="content.data?.title || 'hotspot'"
          class="media-source"
        >

        <div
          v-else
          class="media-controls"
        >
          <template v-if="isMediaLoadedDelayEnds">
            <button
              class="media-controls__button fullscreen"
              @click="onOpenFullscreenClick"
            />

            <button
              class="media-controls__button play"
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
              class="media-controls__mute"
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
          </template>

          <video
            ref="videoElementRef"
            :muted="isVideoMuted"
            class="media-source"
            loop
            playsinline
            crossorigin="anonymous"
            preload="auto"
            @play="onPlay"
            @pause="onPause"
            @ended="onPause"
            @volumechange="onVolumeChange"
            @webkitendfullscreen="()=>{
              onFullScreen(false)
            }"
            @webkitbeginfullscreen="()=>{
              onFullScreen(true)
            }"
            @fullscreenchange="()=>{
              onFullScreen()
            }"
          >
            <source
              type="video/mp4"
              :src="mediaSrc"
            >
          </video>
        </div>
      </template>
    </div>

    <div
      v-if="content.data.title"
      class="hotspot-modal-common-title"
    >
      {{ content?.data.title }}
    </div>

    <div
      ref="descriptionRef"
      class="description-container"
    >
      <div
        v-if="content.data.description"
        :class="{ 'hotspot-modal-common-description': true, 'is-long-text': isLongText }"
      >
        <p
          v-for="(rowText, index) in content.data.description.split('\n')"
          :key="index"
        >
          {{ rowText }}
        </p>
      </div>

      <div
        v-if="isLongText"
        class="blur-bottom"
      />
    </div>

    <div class="button-container">
      <button
        class="base-button hotspot-modal-common-button"
        @click="() => {
          props.onCloseAction();
          soundService?.play(screenName);
        }"
      >
        OK
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .hotspot-modal-content-common {
    background-color: $c-white;
    border-radius: 8px;
    box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.36);
    padding: 20px;

    .media-container {
      @include flexBox(column, center, center);
      position: relative;
      width: 100%;
      height: 187px;
      background-color: $c-white;
      margin-bottom: 20px;
      border-radius: 6px;

      overflow: hidden;
      transform: translateZ(0);

      .modal-error {
        color: $c-carmine-red;
      }
    }

    .media-controls {
      position: absolute;
      z-index: 10;
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

    .media-source {
        position: absolute;
        z-index: 0;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

    .hotspot-modal-common-title {
      @include textWithoutFName(18px, 700, 95%);
      font-family: GothamBold, sans-serif;
      width: 100%;
      margin-bottom: 15px;
    }

    .description-container {
      @include textWithoutFName(16px, 400, 110%);
      position: relative;
      font-family: GothamBook, sans-serif;
      height: max-content;
      margin-bottom: 30px;

      .hotspot-modal-common-description {
        max-height: 240px;
        overflow: auto;

        p {
          min-height: 16px;
        }
      }

      .blur-bottom {
        position: absolute;
        left: 0;
        bottom: -1px;
        right: 0;
        height: 30px;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
        pointer-events: none;
      }
    }

    .button-container {
      width: 100%;
      padding-bottom: 15px;
      .hotspot-modal-common-button {
        border: 2px solid $c-dark-green;
      }
    }
  }

  .is-long-text {
    padding-bottom: 30px;
  }
</style>
