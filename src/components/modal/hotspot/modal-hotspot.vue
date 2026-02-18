<script setup lang="ts">
  import { EAframe3DObjectType } from '~/types/aframe-scene';
  import { EHotspotContentType } from '~/types/hotspot';
  import CommonContentView from '~/components/modal/hotspot/components/common-content-view.vue';
  import VideoContentView from '~/components/modal/hotspot/components/video-content-view.vue';

  const aframeStore = useAframeStore();
  const { activeSceneData } = storeToRefs(aframeStore);

  const hotspotActive = computed(() => {
    return activeSceneData.value?.data.hotspots.find((hotspot) => hotspot.isActive);
  });

  const commonContent = computed(() => {
    if (hotspotActive?.value?.content.type === EHotspotContentType.COMMON) return hotspotActive.value.content;
  });
  const videoContent = computed(() => {
    if (hotspotActive?.value?.content.type === EHotspotContentType.VIDEO) return hotspotActive.value.content;
  });

  const closeModal = () => {
    if (hotspotActive.value) {
      aframeStore.editActiveSceneData({
        id: hotspotActive.value.id,
        type: EAframe3DObjectType.HOTSPOT,
        data: {
          isActive: false
        }
      });
    }
  };
</script>

<template>
  <div
    v-if="hotspotActive"
    class="hotspot-modal"
  >
    <CommonContentView
      v-if="commonContent"
      :content="commonContent"
      :on-close-action="closeModal"
      class="hotspot-modal-content"
    />

    <VideoContentView
      v-if="videoContent"
      :content="videoContent"
      :on-close-action="closeModal"
    />
  </div>
</template>

<style scoped lang="scss">
  .hotspot-modal {
    @include flexBox(row, center, center);
    color: $c-dark-green;
    text-align: start;

    .hotspot-modal-content {
      width: 80%;
      max-width: 335px;
    }
  }
</style>
