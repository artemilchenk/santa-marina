<script setup lang="ts">
  import backButtonImage from '~/assets/images/arrow-back.svg';
  import { RotateManipulation } from '~/aframe-components/custom/rotate-manipulation';
  import { PlaySkyboxVideo } from '~/aframe-components/custom/play-skybox-video';
  import { useAppStore } from '~/stores/app-store';
  import { useAframeStore } from '~/stores/aframe-store';
  import { useAssetsStore } from '~/stores/assets-store';
  import { useTransitionStore } from '~/stores/transition-store';
  import { AFRAME_SCENES } from '~/mocks/aframe-scene';
  import { EAframe3DObjectType, type IAframe3DModel } from '~/types/aframe-scene';
  import type { IHotspot } from '~/types/hotspot';
  import { isCoordinatesValid } from '~/utils/coordinates';
  import { EPortalType } from '~/types/portal';
  import ModalNavigation from '~/components/modal/navigation/modal-navigation.vue';
  import FadeInOut from '~/components/ui/fade-in-out.vue';
  import { type SoundService } from '~/services/sound-service';
  import { ESoundEffectName, ESoundType } from '~/types/sound';
  import { MaxAnisotropy } from '~/aframe-components/custom/max-anisotropy';
  import { CSS2DLabelRenderer } from '~/aframe-components/custom/css-2d-label-renderer';
  import { CSS2DLabelObject } from '~/aframe-components/custom/css-2d-label-object';
  import { AFRAME_AFTER_SCENE_CHANGING_DELAY, AFRAME_ELEMENTS_APPEARING_DELAY } from '~/constants/common';
  import AframeVideoSkybox from '~/components/aframe-video-skybox.vue';
  import { storeToRefs } from 'pinia';
  import { capitalize } from '~/utils/common';
  import type { MtxLogger } from '~/services/mtx-logger';

  const appStore = useAppStore();
  const aframeStore = useAframeStore();
  const assetsStore = useAssetsStore();
  const transitionStore = useTransitionStore();
  const soundService = inject<SoundService>('soundService');
  const mtxLogger = inject<MtxLogger>('mtxLogger');

  const { screenName, isInstructionViewed } = storeToRefs(appStore);
  const { hasGyroscopeAccess, activeSceneData, isBackPortalOnScreen, mtxDisplacementPos } = storeToRefs(aframeStore);
  const { loadedSkyboxVideos } = storeToRefs(assetsStore);

  const aframeComponents = {
    'rotate-manipulation': RotateManipulation,
    'play-skybox-video': PlaySkyboxVideo,
    'css-2d-label-renderer': CSS2DLabelRenderer,
    'css-2d-label-object': CSS2DLabelObject,
    'max-anisotropy': MaxAnisotropy
  };
  const shaders: string[] = [];
  const sceneAttributes = {
    renderer: 'colorManagement: true; antialias: true; high-dpi: true;',
    'xr-mode-ui': 'enabled: false',
    'vr-mode-ui': 'enabled: false',
    'ar-mode-ui': 'enabled: false',
    embedded: '',
    'device-orientation-permission-ui': 'enabled: false',
    'css-2d-label-renderer': 'enabled: true',
    'loading-screen': 'enabled: false'
  };
  const models: IAframe3DModel[] = [];
  const images: string[][] = [];
  const skyboxImages: string[][] = [];

  const initialHotspots: IHotspot[] = [];

  AFRAME_SCENES.forEach((scene) => {
    const rotation = isCoordinatesValid(scene.data.skybox.image.rotation)
      ? `${scene.data.skybox.image.rotation.x} ${scene.data.skybox.image.rotation.y} ${scene.data.skybox.image.rotation.z}`
      : '0 0 0';

    const skyboxAsset = [`skybox-image-${scene.name}`, scene.data.skybox.image.src, rotation];
    images.push(skyboxAsset);
    skyboxImages.push(skyboxAsset);

    scene.data.portals.forEach((portal) => {
      models.push({ ...portal, scene: scene.name });
    });

    initialHotspots.push(...scene.data.hotspots);
  });

  const skyboxVideos = computed<string[][]>(() => {
    if (loadedSkyboxVideos.value.length === 0) {
      return [];
    }

    const result: string[][] = [];
    loadedSkyboxVideos.value.forEach((asset) => {
      if (!asset.src) {
        return;
      }

      const rotation = isCoordinatesValid(asset.rotation)
        ? `${asset.rotation.x} ${asset.rotation.y} ${asset.rotation.z}`
        : '0 0 0';

      result.push([asset.name, asset.src, rotation]);
    });

    return result;
  });

  const portalExitData = computed(() => {
    if (!activeSceneData.value) return null;

    const portalExit = activeSceneData.value.data.portals.find((portal) => portal.type === EPortalType.EXIT);

    return portalExit || null;
  });

  const isArrowBackVisible = computed(() => {
    if (!portalExitData.value || !activeSceneData.value) {
      return false;
    }

    return activeSceneData.value.data.hotspots.every((hotspot) => hotspot.isChecked);
  });

  const isShouldResetCameraToggle = ref(false);
  const isShouldTargetCameraToggle = ref(false);
  const isLookControlsDisabled = ref(false);
  const isAnimationWithZoom = ref(false);
  const isTargetXAxisOnly = ref(true);
  const isAframeElementsVisible = ref(false);
  const isAfterSceneChangingDelayEnds = ref(false);
  const aframeElementsVisibleTimer = ref<NodeJS.Timeout | null>(null);
  const afterSceneChangingTimer = ref<NodeJS.Timeout | null>(null);
  const activePortalId = ref('');

  const resetCameraHandler = () => {
    isShouldResetCameraToggle.value = !isShouldResetCameraToggle.value;
  };

  const targetCameraHandler = () => {
    isShouldTargetCameraToggle.value = !isShouldTargetCameraToggle.value;
  };

  const onLoadedAssetsHandler = () => {
    aframeStore.setIsAssetsLoaded(true);
  };

  const onPortalClick = (portalId: string) => {
    if (!activeSceneData.value) {
      return;
    }

    const portal = activeSceneData.value.data.portals.find((item) => item.id === portalId);
    if (!portal) return;

    activePortalId.value = `model-${portalId}`;
    targetCameraHandler();

    transitionStore.play({
      isImmediately: false,
      hasTransitionScreen: true,
      onStarted: () => {
        soundService?.play(ESoundEffectName.portalEnter);
        isLookControlsDisabled.value = true;
        isAnimationWithZoom.value = true;
      },
      onFinished: () => {
        isLookControlsDisabled.value = false;
        isAnimationWithZoom.value = false;

        appStore.setScreenName(portal.to);
        mtxLogger?.logEvent('Portal', capitalize(portal.to));

        activePortalId.value = '';
      }
    });
  };

  const onHotspotClick = (hotspotId: string, title: string) => {
    mtxLogger?.logEvent(capitalize(screenName.value), title);
    soundService?.play(ESoundEffectName.hotspotTap);
    aframeStore.editActiveSceneData({
      id: hotspotId,
      type: EAframe3DObjectType.HOTSPOT,
      data: {
        isChecked: true,
        isActive: true
      }
    });
  };

  const onButtonBackClick = () => {
    if (!portalExitData.value) {
      return;
    }

    activePortalId.value = `model-${portalExitData.value.id}`;
    targetCameraHandler();

    transitionStore.play({
      isImmediately: true,
      hasTransitionScreen: false,
      onStarted: () => {
        isLookControlsDisabled.value = true;
        isAnimationWithZoom.value = false;
      },
      onFinished: () => {
        isLookControlsDisabled.value = false;
      }
    });
  };

  watchEffect(() => {
    if (!isInstructionViewed.value) {
      isAframeElementsVisible.value = false;
      return;
    }

    aframeElementsVisibleTimer.value = setTimeout(() => {
      isAframeElementsVisible.value = true;
    }, AFRAME_ELEMENTS_APPEARING_DELAY);
  });

  watch(screenName, () => {
    isAfterSceneChangingDelayEnds.value = false;
    resetCameraHandler();
    soundService?.play(screenName.value);

    if (afterSceneChangingTimer.value) {
      clearTimeout(afterSceneChangingTimer.value);
    }

    afterSceneChangingTimer.value = setTimeout(() => {
      isAfterSceneChangingDelayEnds.value = true;
    }, AFRAME_AFTER_SCENE_CHANGING_DELAY);
  });

  onMounted(() => {
    aframeStore.updateMtxDisplacementPos();
    soundService?.play(screenName.value);
  });

  onUnmounted(() => {
    soundService?.stop(ESoundType.ambience);

    if (aframeElementsVisibleTimer.value) {
      clearTimeout(aframeElementsVisibleTimer.value);
    }

    if (afterSceneChangingTimer.value) {
      clearTimeout(afterSceneChangingTimer.value);
    }
  });
</script>

<template>
  <AframeScene
    :components="aframeComponents"
    :attributes="sceneAttributes"
    :images="images"
    :shaders="shaders"
    :videos="skyboxVideos"
    :on-loaded="onLoadedAssetsHandler"
  >
    <button
      id="back-button"
      :class="[$style.back_button, { [$style.hidden]: !isArrowBackVisible }]"
      @click="onButtonBackClick"
    >
      <img
        :class="$style.back_button__label"
        :src="backButtonImage"
        alt="back-to-lobby"
      >
    </button>

    <a-entity
      id="mtx-displacement-switcher"
      :position="mtxDisplacementPos"
      :rotation="{ x: 0, y: 0, z: 0 }"
    >
      <AframeHotspot
        v-for="hotspot in initialHotspots"
        :id="hotspot.id"
        :key="hotspot.id"
        :title="hotspot.content.data.title"
        :active-screen-name="screenName"
        :active-scene-hotspots="activeSceneData ? activeSceneData.data.hotspots : []"
        :is-visible-element="isAframeElementsVisible"
        :position="`${hotspot.coordinates.x} ${hotspot.coordinates.y} ${hotspot.coordinates.z}`"
        @click="onHotspotClick"
      />

      <AframePortal
        v-for="model in models"
        :id="model.id"
        :key="model.id"
        :active-screen-name="screenName"
        :scene="model.scene"
        :is-in-active-scene="!!activeSceneData && model.scene === activeSceneData.name"
        :active-scene-portals="activeSceneData ? activeSceneData.data.portals : []"
        :animation-delay="activeSceneData ? activeSceneData.data.hotspots.length : 0"
        :is-visible-element="isAframeElementsVisible"
        :position="model.coordinates"
        :size="model.size"
        @click="onPortalClick"
      />

      <AframeVideoSkybox
        :skybox-images="skyboxImages"
        :skybox-videos="skyboxVideos"
        :screen-name="screenName"
      />

      <AframeCamera
        :active-portal-id="activePortalId"
        :exit-portal-id="portalExitData ? '#model-' + portalExitData.id : ''"
        :is-should-reset-camera-toggle="isShouldResetCameraToggle"
        :is-should-target-camera-toggle="isShouldTargetCameraToggle"
        :is-arrow-back-visible="isArrowBackVisible"
        :is-animation-with-zoom="isAnimationWithZoom"
        :is-target-x-axis-only="isTargetXAxisOnly"
        :is-look-controls-disabled="isLookControlsDisabled"
        :has-gyroscope-access="hasGyroscopeAccess"
      />
    </a-entity>

    <FadeInOut>
      <ModalNavigation
        v-if="isBackPortalOnScreen && !!portalExitData && isAfterSceneChangingDelayEnds"
        :class="$style.back_modal"
        @click="
          () => {
            if (!portalExitData) {
              return;
            }

            onPortalClick(portalExitData.id);
          }
        "
      />
    </FadeInOut>
  </AframeScene>
</template>

<style module lang="scss">
  .back_button {
    position: absolute;
    top: 218px;
    right: 0;
    z-index: 3;

    width: 60px;
    height: 60px;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: transform 0.4s ease, opacity 0.4s ease;

    &.hidden {
      display: none;
    }

    &__label {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .back_modal {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 68px;
    z-index: 4;
  }
</style>
