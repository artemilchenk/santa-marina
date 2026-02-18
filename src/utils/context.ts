import DeviceDetector from 'device-detector-js';

export const isMobile =
  /IEMobile|Windows Phone|Lumia|iPhone|iPad|iPod|Android|Blackberry|Playbook|BB10|Mobile Safari|webOs|Mobile|Tablet|Opera Mini|Opera Mobi/i.test(
    navigator.userAgent
  );

const deviceDetector = new DeviceDetector();
const userAgentOutput = window.navigator.userAgent;
const deviceInfo = deviceDetector.parse(userAgentOutput);
export const isIOS = deviceInfo.os ? deviceInfo.os.name.toLowerCase().includes('ios') : false;
export const isAndroid = deviceInfo.os ? deviceInfo.os.name.toLowerCase().includes('android') : false;
export const isMSEdge = deviceInfo.client ? deviceInfo.client.name.toLowerCase().includes('microsoft edge') : false;
export const isAndroidMSEdge = isAndroid && isMSEdge;
