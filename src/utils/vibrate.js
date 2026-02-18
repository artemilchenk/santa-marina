const supportsVibrate = 'vibrate' in navigator;

// Vibration feedback (Android only)
export const vibrate = (dur) => {
  if (supportsVibrate) {
    window.navigator.vibrate(dur);
  }
};
