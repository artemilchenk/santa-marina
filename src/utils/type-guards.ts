import type { TAframeScreenName } from '~/types/aframe-scene';
import { EScreenName } from '~/types/screen';
import { ESoundEffectName } from '~/types/sound';

export const isCurrentType = <T>(value: any, callback: (value: T) => boolean): value is T => {
  return typeof callback === 'function' && callback(value);
};

export const isAmbientSound = (value: any): value is TAframeScreenName => {
  return isCurrentType<TAframeScreenName>(
    value,
    (value) => Object.values(EScreenName).includes(value as EScreenName) && (value as EScreenName) !== EScreenName.START
  );
};

export const isEffectSound = (value: any): value is ESoundEffectName => {
  return isCurrentType<ESoundEffectName>(value, (value) => Object.values(ESoundEffectName).includes(value));
};
