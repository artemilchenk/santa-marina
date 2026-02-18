import type { I3DObject, T3DObjectChangeableData, TAframeScreenName } from '~/types/aframe-scene';

export enum EPortalType {
  ENTRANCE= 'entrance',
  EXIT= 'exit'
}

export interface IPortal extends Omit<I3DObject, 'asset'> {
  type: EPortalType;
  from: TAframeScreenName;
  to: TAframeScreenName;
}

export type TPortalChangeableData = T3DObjectChangeableData & {
  somePortalProp: string
};
