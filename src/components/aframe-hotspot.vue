<template>
  <a-box
    v-if="!!currentHotspot"
    :position="validPosition"
    :visible="isVisible"
    material="opacity: 0"
    depth="1"
    height="1"
    width="1"
    scale="1 1 1"
    :css-2d-label-object="{ innerHTMLClassname: $style.embeded_html, isVisible: isVisible }"
  >
    <div :class="[$style.embeded_html]">
      <GlowingDot
        :id="id"
        :type="activeScreenName === EScreenName.MAIN ? EGlowingDotType.withBlur : EGlowingDotType.withCenter"
        label-prefix="hotspot"
        :disabled="!currentHotspot || currentHotspot.isActive"
        :is-visible="isVisible"
        :animation-delay="currentHotspotIndex !== null ? currentHotspotIndex : undefined"
        :global-animation-delay="animationDelay"
        @click="emit('click', id, title)"
      />
    </div>
  </a-box>
</template>

<script setup lang="ts">
  import { type IHotspot } from '~/types/hotspot';
  import GlowingDot from '~/components/ui/glowing-dot.vue';
  import { EScreenName } from '~/types/screen';
  import { coordinatesToText, isCoordinatesValid } from '~/utils/coordinates';
  import { EGlowingDotType } from '~/types/animation';

  interface IProps {
    id: IHotspot['id'];
    title: string;
    activeSceneHotspots: IHotspot[];
    activeScreenName: EScreenName;
    position?: string;
    isVisibleElement?: boolean;
    animationDelay?: number;
  }

  interface IEmits {
    (event: 'click', hotspotId: string, title: string): void;
  }

  const props = withDefaults(defineProps<IProps>(), {
    position: '5 0 -5',
    isVisibleElement: true,
    animationDelay: 0
  });
  const emit = defineEmits<IEmits>();

  const {
    id,
    title,
    activeSceneHotspots,
    position: positionInitial,
    activeScreenName,
    isVisibleElement,
    animationDelay
  } = toRefs(props);

  const currentHotspot = computed<IHotspot | null>(() => {
    if (activeSceneHotspots.value.length === 0) {
      return null;
    }

    const result = activeSceneHotspots.value.find((item) => item.id === id.value);

    return result || null;
  });

  const currentHotspotIndex = computed<number | null>(() => {
    if (activeSceneHotspots.value.length === 0) {
      return null;
    }

    const result = activeSceneHotspots.value.findIndex((item) => item.id === id.value);

    return result === -1 ? null : result;
  });

  const validPosition = computed(() => {
    const position = currentHotspot.value ? coordinatesToText(currentHotspot.value.coordinates) : positionInitial.value;

    if (!isCoordinatesValid(position)) {
      console.warn(`Hotspot position with id ${id.value} is invalid.`);
      return '0 0 -5';
    }

    return position;
  });

  const isVisible = computed(() =>
    isVisibleElement.value && currentHotspot.value ? currentHotspot.value.isVisible : false
  );
</script>

<style module lang="scss">
  .embeded_html {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;

    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;

    &:global(.hidden) {
      visibility: hidden;
    }
  }
</style>
