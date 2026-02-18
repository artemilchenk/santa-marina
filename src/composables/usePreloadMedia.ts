import { preload as preloadUtil } from '~/utils/preload';
import { ref, type Ref } from 'vue';

type TReturn = {
  loadMediaRequest: (mediaPath: string, mediaType: 'image' | 'video') => Promise<void>;
  isMediaLoading: Ref<boolean>;
  isMediaLoaded: Ref<boolean>;
  mediaSrc: Ref<string | null>;
  loadErrorText: Ref<string | null>;
};

export const usePreloadMedia = (): TReturn => {
  const isMediaLoading = ref<boolean>(false);
  const isMediaLoaded = ref<boolean>(false);
  const mediaSrc = ref<string | null>(null);
  const loadErrorText = ref<string | null>(null);

  const loadMediaRequest = async (mediaPath: string, mediaType: 'image' | 'video') => {
    try {
      isMediaLoaded.value = false;
      isMediaLoading.value = true;
      const crs = await preloadUtil(mediaPath, mediaType);
      mediaSrc.value = crs;
      isMediaLoaded.value = true;
    } catch (e) {
      loadErrorText.value = 'Media is not loaded';
    } finally {
      isMediaLoading.value = false;
    }
  };

  return { loadMediaRequest, mediaSrc, isMediaLoading, isMediaLoaded, loadErrorText };
};
