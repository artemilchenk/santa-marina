<template>
  <div
    id="gui"
    class="gui"
    @click="onUIClick"
  >
    <Transition>
      <GuiHeaderComponent
        v-if="isNotStartPage && !isPreloaderVisible"
        class="gui__header"
      />
    </Transition>

    <TransitionScreen class="gui__transition" />

    <HotspotPrompt class="gui__hotspot-prompt" />

    <Transition>
      <HotspotModal class="gui__hotspot" />
    </Transition>

    <Transition name="instruction-modal-fade">
      <InstructionModal
        v-if="isNotStartPage"
        class="gui__instruction"
      />
    </Transition>

    <Transition name="loader-fade">
      <Preloader
        v-if="isPreloaderVisible"
        class="gui__preloader"
      />
    </Transition>

    <Transition>
      <component
        :is="screen"
        class="gui__item gui__content"
        :class="isNotStartPage && 'with-header'"
      />
    </Transition>

    <Transition>
      <GuiFooter
        v-if="isNotStartPage"
        class="gui__footer"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { EScreenName } from '~/types/screen';
  import InstructionModal from '~/components/modal/instruction/modal-instruction.vue';
  import HotspotModal from '~/components/modal/hotspot/modal-hotspot.vue';
  import type { SoundService } from '~/services/sound-service';
  import { ESoundEffectName } from '~/types/sound';
  import GuiFooter from '~/components/gui-footer.vue';

  const appStore = useAppStore();
  const aframeStore = useAframeStore();
  const soundService = inject<SoundService>('soundService');

  const { screen, screenName } = storeToRefs(appStore);
  const { isAssetsLoaded } = storeToRefs(aframeStore);

  const isNotStartPage = computed(() => {
    return screenName.value !== EScreenName.START;
  });

  const isPreloaderVisible = computed(() => {
    return !isAssetsLoaded.value && isNotStartPage.value;
  });

  const onUIClick = () => {
    soundService?.play(ESoundEffectName.uiTap);
  };
</script>

<style scoped lang="scss">
  .gui {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;

    &__header {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
    }

    &__nav-modal {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 4;
    }

    &__hotspot {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 14;
    }

    &__hotspot-prompt {
      position: absolute;
      left: 50%;
      right: 0;
      bottom: 68px;
      z-index: 3;

      transform: translate(-50%, 0);
    }

    &__instruction {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9;
    }

    &__item {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;

      &.with-header {
        transform: translateY(60px);
        height: calc(100% - 60px);
      }
    }

    &__content {
      z-index: 1;
    }

    &__preloader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      z-index: 11;
    }

    &__transition {
      z-index: 9;
    }

    &__footer {
      z-index: 2;
    }
  }

  //default-transition
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  //instruction-modal-transition
  .instruction-modal-fade-enter-active {
    transition: opacity 0.5s ease 1.5s;
  }
  .instruction-modal-fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .instruction-modal-fade-enter-from,
  .instruction-modal-fade-leave-to {
    opacity: 0;
  }

  //loader-transition
  .loader-fade-enter-active,
  .loader-fade-leave-active {
    transition: opacity 0.5s ease 0.5s;
  }

  .loader-fade-enter-from,
  .loader-fade-leave-to {
    opacity: 0;
  }
</style>
