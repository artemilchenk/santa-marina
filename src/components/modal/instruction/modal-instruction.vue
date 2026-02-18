<script setup lang="ts">
  import InstructionContent from '~/components/modal/instruction/components/instruction-content.vue';

  const appStore = useAppStore();
  const isModalVisible = ref<boolean>(true);

  const hideModal = () => {
    isModalVisible.value = false;
    appStore.setIsInstructionViewed(true);
  };
</script>

<template>
  <div
    v-if="isModalVisible"
    class="instruction-modal"
  >
    <InstructionContent
      @click="hideModal"
    />
  </div>
</template>

<style scoped lang="scss">
  .instruction-modal {
    @include textWithoutFName(20px, 700, 95.7%);
    font-family: GothamBold, sans-serif;
    color: $c-white;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(2px);
    transition: filter 0.3s ease;
    background: rgba(0, 0, 0, 0.58);
  }
</style>
