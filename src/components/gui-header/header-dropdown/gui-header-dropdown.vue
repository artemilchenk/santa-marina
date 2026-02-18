<script setup lang="ts">
  import FadeInOut from '~/components/ui/fade-in-out.vue';
  import { DROP_DATA } from '~/mocks/drop-data';
  import { AFRAME_SCENES } from '~/mocks/aframe-scene';
  import type { TDropdownOptionData } from '~/types/dropdown';
  import { EScreenName } from '~/types/screen';
  import { capitalize } from '~/utils/common';
  import type { MtxLogger } from '~/services/mtx-logger';

  const appStore = useAppStore();
  const transitionStore = useTransitionStore();
  const mtxLogger = inject<MtxLogger>('mtxLogger');

  const { screenName } = storeToRefs(appStore);
  const { isTransitionScreenVisible: isTransitionPlaying } = storeToRefs(transitionStore);

  const isOpen = ref<boolean>(false);
  const selected = computed<TDropdownOptionData | null>(() => {
    const activeDropData = DROP_DATA.find((item) => item.value === screenName.value);

    return activeDropData || null;
  });

  const selectOption = (option: TDropdownOptionData) => {
    transitionStore.play({
      isImmediately: false,
      hasTransitionScreen: true,
      onFinished: () => {
        appStore.setScreenName(option.value);

        if (option.value !== EScreenName.START) {
          mtxLogger?.logEvent('Portal', capitalize(option.value));
        }
      }
    });
  };

  const toggleOpen = () => {
    isOpen.value = !isOpen.value;
  };
</script>

<template>

</template>

<style scoped lang="scss">
  .dropdown-header {
    @include textWithoutFName(16px, 400, 95.68%);

    &-button {
      @include flexBox(row, center, center);
      gap: 14px;

      cursor: pointer;
      color: $c-dark-green;

      &__text {
        @include textWithoutFName(16px, 400, 19.2px);
        font-family: GothamBook, sans-serif;
      }
    }

    &__burger {
      flex-shrink: 0;
      width: 20px;
      height: 16px;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      span {
        width: 100%;
        background-color: currentColor;
        height: 2px;
        border-radius: 2px;
        transition: all 0.3s ease;

        @at-root .dropdown-header__burger.is-open span {
          &:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
          }

          &:nth-child(2) {
            opacity: 0;
          }

          &:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
          }
        }
      }
    }
  }

  .dropdown-list {
    position: absolute;
    top: 100%;
    right: 0;
    width: 169px;
    background: #fff;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    padding: 0;
    list-style: none;
  }

  .dropdown-item {
    @include flexBox(row, flex-start, center);
    width: 100%;
    padding-left: 15px;
    height: 30px;

    cursor: pointer;
    color: $c-dark-green;

    &:first-child {
      padding-top: 5px;
    }

    &:last-child {
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    &.is-selected {
      pointer-events: none;
      cursor: default;
      background-color: $c-light-green;
    }

    &.disabled {
      pointer-events: none;
      cursor: default;
      opacity: 0.4;
    }
  }

</style>
