<template>
  <button
    :class="[
      $style.dot,
      type === EGlowingDotType.withCenter && $style.withCenter,
      !isVisible && $style.hidden
    ]"
    :aria-label="`${labelPrefix}-${id}`"
    :disabled="disabled"
    :style="{
      ['--animation-delay']: `${animationDelay }`,
      ['--global-animation-delay']: `${globalAnimationDelay}`
    }"
    @click.stop="emit('click', id)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
  import { EGlowingDotType } from '~/types/animation';

  interface IProps {
    labelPrefix?: string;
    id: string;
    type?: EGlowingDotType;
    disabled?: boolean;
    isVisible?: boolean;
    animationDelay?: number;
    globalAnimationDelay?: number;
  }

  interface IEmits {
    (event: 'click', hotspotId: string): void;
  }

  const props = withDefaults(defineProps<IProps>(), {
    labelPrefix: 'item',
    type: EGlowingDotType.withBlur,
    disabled: false,
    isVisible: true,
    animationDelay: 0,
    globalAnimationDelay: 0
  });

  const emit = defineEmits<IEmits>();

  const { labelPrefix, id, disabled, animationDelay, isVisible } = toRefs(props);
</script>

<style module lang="scss">
  .dot {
    @include flexBox(row, center, center);
    @include circle(40px);

    --animation-delay: 0;
    --global-animation-delay: 0;
    --animation-duration: 2s;
    --animation-delay-calculated: calc(
      (var(--animation-delay) + var(--global-animation-delay))
      * (calc(var(--animation-duration)) * 0.8));
    position: relative;
    transition: color 0.4s ease;
    z-index: 0;

    &::before {
      @include absTopLeft(50%, 50%);
      @include circle(100%);
      display: block;
      content: '';
      border: 2px solid $c-white;
      transform: translate(-50%, -50%) scale(0);
      transform-origin: center center;
      animation: scale-animation var(--animation-duration) ease-in infinite;
      animation-play-state: running;
      animation-delay: var(--animation-delay-calculated);
      z-index: 0;

      @at-root .dot.hidden::before {
        animation-play-state: paused;
      }
    }

    &::after {
      @include absTopLeft(50%, 50%);
      @include circle(0);
      display: block;
      content: '';

      transform: translate(-50%, -50%);
      background-color: #fff;
      animation: glow var(--animation-duration) ease-in infinite;
      animation-play-state: running;
      animation-delay: var(--animation-delay-calculated);
      z-index: 1;

      @at-root .dot.hidden::after {
        animation-play-state: paused;
      }
    }

    &.withCenter {
      @include circle(78px);

      &::after {
        @include circle(10px);
        animation: glow2 var(--animation-duration) ease-in infinite;
        animation-delay: var(--animation-delay-calculated);
      }
    }
  }

  @keyframes scale-animation {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }

  @keyframes glow {
    from {
      box-shadow:
        0 0 40px 5px #000,
        0 0 0 0 #ffff,
        0 0 0 0 #ffff,
        0 0 0 0 #ffff,
        0 0 0 0 #ffff,
        0 0 0 0 #ffff;
    }
    to {
      box-shadow:
        0 0 40px 5px #000,
        0 0 10px 5px #fff8,
        0 0 20px 10px #fff6,
        0 0 30px 15px #fff4,
        0 0 40px 20px #fff2,
        0 0 50px 25px #fff0;
    }
  }

  @keyframes glow2 {
    from {
      box-shadow:
        0 0 40px 5px #000,
        0 0 0 0 #ffff,
        0 0 0 0 #ffff,
        0 0 0 0 #ffff,
        0 0 0 0 #ffff,
        0 0 0 0 #ffff;
    }
    to {
      box-shadow:
        0 0 40px 5px #000,
        0 0 50px 5px #fff8,
        0 0 60px 10px #fff6,
        0 0 70px 15px #fff4,
        0 0 80px 20px #fff2,
        0 0 90px 25px #fff0;
    }
  }
</style>
