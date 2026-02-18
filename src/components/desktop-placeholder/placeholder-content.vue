<script setup lang="ts">
  import QRCode, { type QRCodeRenderersOptions } from 'qrcode';
  import { replaceCurrentWord } from '~/utils/common';

  const qrCanvasElement = ref<HTMLCanvasElement | null>(null);

  const appendQRCodeCanvas = (targetCanvas: HTMLCanvasElement, link: string) => {
    const options: QRCodeRenderersOptions = {
      width: 250,
      margin: 0,
      errorCorrectionLevel: 'Q'
    };

    QRCode.toCanvas(targetCanvas, link, options, (error) => {
      if (error) {
        console.error(error);
      }
    });
  };

  const mountQRCode = async () => {
    if (!qrCanvasElement.value) return;

    let link = window.location.origin + window.location.pathname;
    if (process.env.NODE_ENV === 'development') {
      const { data } = await useFetch('/api/local-ip');
      const localIp = data.value;
      if (localIp) link = replaceCurrentWord(link, 'localhost', localIp);
    }
    appendQRCodeCanvas(qrCanvasElement.value, link);
  };

  watch(qrCanvasElement, (value) => {
    if (value) {
      mountQRCode();
    }
  });
</script>

<template>
  <div class="placeholder-content">
    <div class="placeholder-content__logo">
      <img
        src="~/assets/images/logo.png"
        alt="Logo"
      >
    </div>

    <div class="placeholder-content__text">
      Explore the wonders of Costa Rica through immersive 3D portals.
    </div>

    <div class="placeholder-content__sublogo">
      <img
        src="~/assets/images/sub-logo.png"
        alt="SubLogo"
      >
    </div>

    <div class="placeholder-content-qr">
      <canvas
        ref="qrCanvasElement"
        class="placeholder-content-qr__canvas"
      />

      <div class="placeholder-content-qr__text">
        To view, open camera on smartphone and scan the QR code
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .placeholder-content {
    @include flexBox(column, center, center);

    position: absolute;
    top: 55px;
    left: 50%;

    width: 100%;

    transform: translate(-50%);

    font-family: 'GothamBook', sans-serif;
    color: $c-white;

    > * {
      + * {
        margin-top: calc(3.32 * var(--vh));
      }

      + .placeholder-content__sublogo {
        margin-top: 9px;
      }

      + .placeholder-content-qr {
        margin-top: 43px;
        margin-top: calc(4.199 * var(--vh));
      }
    }

    &__logo {
      max-width: 372px;

      img {
        width: 100%;
        height: auto;
      }
    }

    &__text {
      @include textWithoutFName(16px, 400, 150%);

      letter-spacing: 0.02em;
    }

    &__sublogo {
      max-width: 128px;

      img {
        width: 100%;
        height: auto;
      }
    }

    &-qr {
      @include flexBox(column, center, center);
      width: 249px;
      gap: 11px;

      &__canvas {
        width: calc(28 * var(--vh)) !important;
        max-width: 250px !important;
        min-width: 150px !important;

        height: calc(28 * var(--vh)) !important;
        max-height: 250px !important;
        min-height: 150px !important;
      }

      &__text {
        @include textWithoutFName(22px, 400, 127%);
        display: grid;

        letter-spacing: 0.02em;
        text-align: center;
      }
    }
  }
</style>
