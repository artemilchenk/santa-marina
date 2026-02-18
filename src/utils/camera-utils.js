export const getCameraBackStream = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'
      }
    });
  }
};

export const requestDeviceMotionPermission = async () => {
  if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      await DeviceMotionEvent.requestPermission();
    } catch (error) {
      console.error(error);
    }
  }
};

export const requestDeviceMotionAndCamera = async () => {
  let stream = null;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      stream = await getCameraBackStream();
      await requestDeviceMotionPermission();
    } catch (error) {
      console.error(error);
    }
  }

  return stream;
};

export const stopMediaStream = (stream) => {
  if (stream && typeof stream.getTracks === 'function') {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
};
