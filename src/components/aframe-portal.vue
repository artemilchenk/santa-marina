<template>
  <a-box
    v-if="currentPortal"
    :id="`model-${id}`"
    :visible="isVisible"
    :class="currentPortal?.isClickable && 'clickable'"
    :position="`${position.x} ${position.y} ${position.z}`"
    material="opacity: 0"
    :depth="size.depth"
    :height="size.height"
    :width="size.width"
    scale="1 1 1"
    :css-2d-label-object="{
      innerHTMLClassname: $style.embedded_html,
      isVisible: isVisible && currentPortal.type === EPortalType.ENTRANCE
    }"
    @click="onClick"
  >
    <div :class="[$style.embedded_html]">
      <GlowingDot
        :id="id"
        label-prefix="model-label"
        :type="activeScreenName === EScreenName.MAIN ? EGlowingDotType.withBlur : EGlowingDotType.withCenter"
        :is-visible="isVisible"
        :animation-delay="currentPortalIndex !== null ? currentPortalIndex : undefined"
        :global-animation-delay="animationDelay"
        @click="onClick"
      />
    </div>
  </a-box>
</template>

<script setup lang="ts">
  import type { IAframe3DModel, IBoxSize, ICoordinates } from '~/types/aframe-scene';
  import { EPortalType, type IPortal } from '~/types/portal';
  import GlowingDot from '~/components/ui/glowing-dot.vue';
  import { EScreenName } from '~/types/screen';
  import { EGlowingDotType } from '~/types/animation';

  interface IProps {
    id: IAframe3DModel['id'];
    isInActiveScene?: boolean;
    isVisibleElement?: boolean;
    activeScenePortals: IPortal[];
    activeScreenName: EScreenName;
    position?: ICoordinates;
    size?: IBoxSize;
    animationDelay?: number;
  }

  interface IEmits {
    (event: 'click', portalId: string): void;
  }

  const props = withDefaults(defineProps<IProps>(), {
    position: () => ({ x: 5, y: 0, z: -5 }),
    size: () => ({ width: 1, height: 1, depth: 1 }),
    isInActiveScene: false,
    isVisibleElement: true,
    animationDelay: 0
  });

  const emit = defineEmits<IEmits>();

  const {
    id,
    isInActiveScene,
    position,
    size,
    activeScenePortals,
    activeScreenName,
    isVisibleElement,
    animationDelay
  } = toRefs(props);

  const currentPortal = computed<IPortal | null>(() => {
    if (activeScenePortals.value.length === 0) {
      return null;
    }

    const result = activeScenePortals.value.find((item) => item.id === id.value);

    return result || null;
  });

  const currentPortalIndex = computed<number | null>(() => {
    if (activeScenePortals.value.length === 0) {
      return null;
    }

    const result = activeScenePortals.value.findIndex((item) => item.id === id.value);

    return result === -1 ? null : result;
  });

  const isVisible = computed(() => isVisibleElement.value && isInActiveScene.value && currentPortal.value?.isVisible);

  const onClick = () => {
    if (!currentPortal.value || !currentPortal.value.isClickable) return;

    emit('click', id.value);
  };
</script>

<style module lang="scss">
  .embedded_html {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;

    display: flex;
    justify-content: center;
    align-items: center;

    &:global(.hidden) {
      visibility: hidden;
    }
  }

  .portal {
    position: relative;
    bottom: 40px;
    z-index: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 22px;
    height: 22px;

    border-radius: 50%;

    transition: color 0.4s ease;
    color: $c-carmine-red;

    &::before {
      display: block;
      content: '';
      position: absolute;
      z-index: 1;

      top: 50%;
      left: 50%;

      width: 100%;
      height: 100%;
      border: 2px solid $c-white;
      border-radius: inherit;

      transform: translate(-50%, -50%);

      transform-origin: center center;
      animation-name: scale-animation;
      animation-duration: 2s;
      animation-timing-function: ease;
      animation-iteration-count: infinite;
      animation-play-state: running;

      @at-root .embedded_html:global(.hidden) .portal::before {
        animation-play-state: paused;
      }

      @keyframes scale-animation {
        0% {
          transform: translate(-50%, -50%) scale(0.6);
          opacity: 1;
        }

        70% {
          opacity: 1;
        }

        100% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0;
        }
      }
    }

    &::after {
      display: block;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;

      width: 100%;
      height: 100%;

      border-radius: inherit;

      background-color: currentColor;
    }

    &__inner {
      position: absolute;
      left: 11px;
      padding: 4px 10px 4px 18px;

      display: flex;
      justify-content: center;
      align-items: center;

      @include textWithoutFName(8px, 700, 95%);
      font-family: GothamBold, sans-serif;
      text-transform: capitalize;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;

      transition: opacity 0.4s ease;
      opacity: 1;
      color: $c-white;
      border-radius: 22px;

      background-color: $c-carmine-red;
    }
  }
</style>
