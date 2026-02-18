import type { TAframeScreenName } from '~/types/aframe-scene';

export enum ESoundType {
  ambience = 'ambience',
  effect = 'effect'
}

export enum ESoundEffectName {
  hotspotTap = 'hotspot-tap',
  uiTap = 'ui-tap',
  portalEnter = 'portal-enter',
}

export interface Sound {
  id: string;
  type: ESoundType;
  src: string;
}

export interface AmbienceSound extends Sound {
  id: TAframeScreenName;
  type: ESoundType.ambience;
  loop: boolean;
}

export interface EffectSound extends Sound {
  id: ESoundEffectName;
  type: ESoundType.effect;
}
