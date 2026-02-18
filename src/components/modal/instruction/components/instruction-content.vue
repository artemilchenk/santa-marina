<template>
  <div class="instruction-container">
    <div class="instruction-content">
      <div class="instruction-text">
        {{ currentContent.text }}
      </div>

      <div class="instruction-icon">
        <img
          :width="currentContent.width"
          height="auto"
          :src="currentContent.icon"
          alt="-instruction-icon"
        />
      </div>
    </div>

    <button
      class="instruction-button"
      @click="onClick"
    >
      OK
    </button>
  </div>
</template>

<script setup lang="ts">
  import { type GameInstruction, InstructionName } from '~/types/instruction';
  import { GAME_INSTRUCTIONS } from '~/mocks/instruction';

  interface IEmits {
    (event: 'click'): void;
  }

  const emit = defineEmits<IEmits>();

  const aframeStore = useAframeStore();

  const { hasGyroscopeAccess } = storeToRefs(aframeStore);

  const currentContent = computed((): GameInstruction => {
    if (hasGyroscopeAccess.value) {
      return GAME_INSTRUCTIONS[InstructionName.LOOK];
    }
    return GAME_INSTRUCTIONS[InstructionName.SWIPE];
  });

  const onClick = () => {
    emit('click');
  };
</script>

<style scoped lang="scss">
  .instruction-container {
    @include absTopLeft(0, 0);
    @include stretchedRectangle;
    @include flexBox(column, center, center, 127px);
    z-index: 10;

    .instruction-content {
      @include flexBox(column, center, center, 35px);

      .instruction-text {
        text-align: center;
        width: 300px;
      }

      .instruction-icon {
        @include square(135px);

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .instruction-button {
      @include flexBox(row, center, center);
      @include textWithoutFName(18px, 700, 95%);
      padding: 10px 80px 10px 80px;
      font-family: 'Gotham', sans-serif;
      color: $c-white;
      border-radius: 8px;
      border: 2px solid $c-white;
    }
  }
</style>
