<template>
  <header class="header">
    <img
      width="94"
      height="43"
      :src="Logo"
      alt="Logo"
      @click="onLogoClick"
    >

    <GuiHeaderDropdown />
  </header>
</template>
<script setup lang="ts">
  import GuiHeaderDropdown from '~/components/gui-header/header-dropdown/gui-header-dropdown.vue';
  import Logo from '~/assets/images/header-logo.svg';
  import { MtxLogger } from '~/services/mtx-logger';
  import { LOGO_LINK } from '~/constants/common';

  const mtxLogger = inject<MtxLogger>('mtxLogger');

  const onLogoClick = () => {
    mtxLogger?.logEvent('Interactions', 'Website clicks');
    window.open(LOGO_LINK, '_blank');
  };
</script>

<style scoped lang="scss">
  .header {
    @include flexBox(row, space-between, center);
    font-family: GothamBook, sans-serif;
    color: $c-dark-green;
    width: 100%;
    height: 60px;
    padding-left: 9px;
    padding-right: 17px;

    background-color: #fff;
  }
</style>
