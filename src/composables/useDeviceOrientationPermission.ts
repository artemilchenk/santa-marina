import { isAndroid } from '~/utils/context';

const useDeviceOrientationPermission = (onRequestEnds?: (hasPermission: boolean) => void) => {
  const hasPermission = ref(false);
  const isPending = ref(false);
  const isResponded = ref(false);
  const hasError = ref(false);

  const makeRequest = async () => {
    isResponded.value = false;
    isPending.value = false;
    hasError.value = false;

    // @ts-ignore: Unreachable code error
    if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
      hasPermission.value = isAndroid;

      if (onRequestEnds) {
        onRequestEnds(hasPermission.value);
      }

      isResponded.value = true;
      return;
    }

    try {
      isPending.value = true;
      // @ts-ignore: Unreachable code error
      const response: 'granted' | 'denied' = await DeviceOrientationEvent.requestPermission();

      if (response === 'granted') {
        hasPermission.value = true;
        return;
      }

      hasPermission.value = false;
    } catch (error) {
      console.warn('DeviceOrientationEvent error: ', error);
      hasError.value = true;
      hasPermission.value = false;
    } finally {
      isResponded.value = true;
      isPending.value = false;

      if (onRequestEnds) {
        onRequestEnds(hasPermission.value);
      }
    }
  };

  return { makeRequest, hasPermission, isResponded, isPending, hasError };
};

export default useDeviceOrientationPermission;
