<script setup lang="ts">
  import logoImg from '~/assets/images/logo.png';
  import rotateIcon from '~/assets/icons/rotate-logo.svg';
</script>

<template>
  <div class="rotate-placeholder">
    <div class="rotate-placeholder-container">
      <img
        width="101"
        height="auto"
        :src="logoImg"
        alt="Logo"
      />

      <div class="rotate-placeholder-main">
        <img
          width="auto"
          height="auto"
          :src="rotateIcon"
          alt="Logo"
        />

        <div class="rotate-placeholder-info">
          <div class="rotate-placeholder-title">ROTATE DEVICE</div>

          <div class="rotate-placeholder-text">
            This experience has been optimized for portrait viewing mode. Please rotate back to portrait to continue.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .rotate-placeholder {
    @include flexBox(column, center, center);
    font-family: 'GothamBold', sans-serif;
    color: $c-white;
    height: 100%;
    background-color: $c-dark-green;

    .rotate-placeholder-container {
      @include flexBox(column, center, center);
      width: 600px;

      .rotate-placeholder-main {
        @include flexBox(row, center, center);

        .rotate-placeholder-info {
          @include flexBox(column, center, flex-start);
          gap: 10px;

          .rotate-placeholder-title {
            @include textWithoutFName(40px, 700, 95%);
          }

          .rotate-placeholder-text {
            @include textWithoutFName(20px, 700, 95%);
          }
        }
      }
    }
  }
</style>
