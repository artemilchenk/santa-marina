<script setup lang="ts">
  const emit = defineEmits<{(event: 'click', payload: MouseEvent): void }>();
  const clickHandler = (evt: MouseEvent) => {
    emit('click', evt);
  };
</script>

<template>
  <div class="nav-modal">
    <div class="nav-modal-container">
      <button
        class="nav-modal-button"
        @click="clickHandler"
      >
        Tap on the portal to return
        and explore another doorway
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .nav-modal {
    @include flexBox(column, center, center);
    font-family: 'GothamBold', Arial, sans-serif;

    .nav-modal-container {
      @include flexBox(column, center, center);
      width: 80%;
      max-width: 280px;

      .nav-modal-button {
        @include flexBox(column, center, center);
        @include textWithoutFName(18px, 700, 120%);

        --shadow-blur: 8px;

        border: 0;
        padding: 0;
        margin: 0;

        cursor: pointer;
        font-family: inherit;
        text-align: center;
        text-shadow:
          0px -4px var(--shadow-blur) $c-white,
          0px 4px var(--shadow-blur) $c-white,
          -8px 0px var(--shadow-blur) $c-white,
          8px 0px var(--shadow-blur) $c-white;

        color: $c-dark-green;
        background-color: transparent;
      }
    }
  }
</style>
