<script setup lang="ts">
  import ScreenAframe from '~/components/screen-aframe.vue';
  import { EScreenName } from '~/types/screen';
  import { PRIVACY_LINK } from '~/constants/common';
  import type { MtxLogger } from '~/services/mtx-logger';

  const appStore = useAppStore();
  const aframeStore = useAframeStore();
  const transitionStore = useTransitionStore();
  const mtxLogger = inject<MtxLogger>('mtxLogger');

  const { makeRequest, isPending } = useDeviceOrientationPermission((hasPermission) => {
    transitionStore.play({
      onFinished: () => {
        mtxLogger?.logEvent('Permission', hasPermission ? 'True' : 'False');
        aframeStore.setHasGyroscopeAccess(hasPermission);

        appStore.setScreen(ScreenAframe);
        appStore.setScreenName(EScreenName.MAIN);
      }
    });
  });

  const startButtonClick = async () => {
    mtxLogger?.logEvent('Start experience', 'Start');
    await makeRequest();
  };
</script>

<template>
  <div class="start-screen-content">
    <div class="start-screen-content__wrapper">
      <div class="start-screen-content__logo">
        <img
          src="~/assets/images/logo.png"
          alt="Logo"
        >
      </div>

      <p class="start-screen-content__text">
        Explore the wonders of Costa Rica through immersive 3D portals.
      </p>

      <div class="start-screen-content__sublogo">
        <img
          src="~/assets/images/sub-logo.png"
          alt="SubLogo"
        >
      </div>

      <button
        class="base-button start-screen-content__button"
        :disabled="isPending"
        @click="startButtonClick"
      >
        START
      </button>
    </div>
  </div>

  <div class="start-screen-footer">
    By proceeding, you agree to our
    <a
      :href="PRIVACY_LINK"
      target="_blank"
      rel="noreferrer"
      class="start-screen-link"
    >
      Privacy Policy
    </a>
  </div>
</template>

<style scoped lang="scss">
  .start-screen-content {
    @include flexBox(column, center, center);

    height: 100%;

    &__wrapper {
      @include flexBox(column, center, center);

      margin-top: -24px;
      width: 295px;

      > * {
        + * {
          margin-top: 43px;
        }

        + .start-screen-content__sublogo {
          margin-top: 16px;
        }

        + .start-screen-content__button {
          margin-top: 96px;
        }
      }
    }

    &__logo {
      @include flexBox();

      max-width: 246px;

      img {
        width: 100%;
        height: auto;
      }
    }

    &__text {
      @include textWithoutFName(16px, 400, 24px);

      letter-spacing: 0.02em;
      text-align: center;
    }

    &__sublogo {
      @include flexBox();

      max-width: 101px;

      img {
        width: 100%;
        height: auto;
      }
    }

  }

  .start-screen-footer {
    @include textWithoutFName(12px, 400, 11.48px);

    width: 264px;
    padding-bottom: 20px;
    text-align: center;

    .start-screen-link {
      text-decoration: underline;
      text-decoration-color: $c-white;
      text-decoration-thickness: 1px;
      text-underline-offset: 2px;
      color: $c-white;
    }
  }
</style>
