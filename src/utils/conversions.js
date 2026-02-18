export const toRad = (degrees) => degrees * (Math.PI / 180);
export const toDeg = (radians) => radians * (180 / Math.PI);

// Foggzie - https://stackoverflow.com/a/14224585/10934097
export const rangeConversion = (fromMin, fromMax, toMin, toMax, input) => {
  const percent = (input - fromMin) / (fromMax - fromMin);
  const output = percent * (toMax - toMin) + toMin;
  return output;
};

// Convert a value into a 0-1 range
export const normalize = (value, min, max) => (value - min) / (max - min);

const componentFromStr = (numStr, percent) => {
  const num = Math.max(0, parseInt(numStr, 10));
  return percent ? Math.floor((255 * Math.min(100, num)) / 100) : Math.min(255, num);
};
export const rgbToHex = (rgb) => {
  const rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
  let result;
  let r;
  let g;
  let b;
  let hex = '';
  if ((result = rgbRegex.exec(rgb))) {
    r = componentFromStr(result[1], result[2]);
    g = componentFromStr(result[3], result[4]);
    b = componentFromStr(result[5], result[6]);
    hex = '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  return hex;
};
