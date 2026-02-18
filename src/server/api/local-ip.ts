import os from 'os';

export default defineEventHandler(() => {
  const interfaces = os.networkInterfaces();
  let localIp = null;

  for (const interfaceName in interfaces) {
    // @ts-ignore
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIp = iface.address;
        break;
      }
    }
    if (localIp) break;
  }

  if (localIp) {
    return localIp;
  } else {
    return null;
  }
});
