import { type Ref } from 'vue';
import type { ISkyboxVideoData, ILoadedSkyboxVideo } from '~/types/asset';
import { preload } from '~/utils/preload';
import { AFRAME_SCENES } from '~/mocks/aframe-scene';

interface IState {
  isRequiredAssetsLoaded: Ref<boolean>;
  loadedSkyboxVideos: Ref<ILoadedSkyboxVideo[]>;
}

interface IActions {
  setIsRequiredAssetsLoaded: (isLoaded: boolean) => void;
  setLoadedSkyboxVideos: (asset: ILoadedSkyboxVideo) => void;
  preloadSkyboxVideos: () => void;
}

export const useAssetsStore = defineStore('assets-store', () => {
  const isRequiredAssetsLoaded: IState['isRequiredAssetsLoaded'] = ref(false);
  const loadedSkyboxVideos: IState['loadedSkyboxVideos'] = ref([]);

  const setIsRequiredAssetsLoaded: IActions['setIsRequiredAssetsLoaded'] = (isLoaded) => {
    isRequiredAssetsLoaded.value = isLoaded;
  };

  const setLoadedSkyboxVideos: IActions['setLoadedSkyboxVideos'] = (asset) => {
    // loadedAssets.value = [...loadedAssets.value, asset];
    loadedSkyboxVideos.value.push(asset);
  };

  const preloadSkyboxVideos: IActions['preloadSkyboxVideos'] = async () => {
    const assets: ISkyboxVideoData[] = AFRAME_SCENES.map(scene => ({
      name: scene.name,
      data: scene.data.skybox.video
    }));

    if (assets.length === 0) {
      return;
    }

    for (let index = 0; index < assets.length; index += 1) {
      const asset = assets[index];
      if (!asset) {
        continue;
      }

      const preloadedAsset: ILoadedSkyboxVideo = {
        src: null,
        rotation: asset.data.rotation,
        name: asset.name,
        isLoaded: false,
        hasError: false
      };

      try {
        const response = await preload(asset.data.src);
        preloadedAsset.src = response;
      } catch (error) {
        preloadedAsset.hasError = true;
      } finally {
        preloadedAsset.isLoaded = true;
        setLoadedSkyboxVideos(preloadedAsset);
      }
    }
  };

  return { isRequiredAssetsLoaded, loadedSkyboxVideos, setIsRequiredAssetsLoaded, setLoadedSkyboxVideos, preloadSkyboxVideos };
});
