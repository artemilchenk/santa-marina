import type { EScreenName } from '~/types/screen';
import type { IHotspot, THotspotChangeableData } from '~/types/hotspot';
import type { ISkybox } from '~/types/asset';
import type { IPortal, TPortalChangeableData } from '~/types/portal';

export enum EAframeSceneType {
  MAIN = 'main',
  HOTSPOTS = 'hotspots',
}

export enum EAframe3DObjectType {
  PORTAL = 'portal',
  HOTSPOT = 'hotspot',
}

export type TAframeScreenName = Exclude<EScreenName, EScreenName.START>;

export interface ICoordinates {
  x: number;
  y: number;
  z: number;
}

export interface IBoxSize {
  depth: number;
  height: number;
  width: number;
}

export interface I3DObject {
  id: string;
  coordinates: ICoordinates;
  asset: string;
  isVisible: boolean;
  isClickable: boolean;
  size?: IBoxSize;
}

export type T3DObjectChangeableData = Omit<I3DObject, 'asset' | 'id' | 'type'>;

export interface IAframe3DModel extends Omit<I3DObject, 'asset'> {
  scene: TAframeScreenName;
}

interface IAframeSceneDataBase {
  skybox: ISkybox;
  portals: IPortal[];
  hotspots: IHotspot[];
}

interface IAframeSceneDataHotspots extends IAframeSceneDataBase {
}

interface IAframeSceneDataMain extends IAframeSceneDataBase {
}

interface IAframeSceneBase {
  type: EAframeSceneType;
  name: TAframeScreenName;
  mtxSceneCoords: ICoordinates;
}

interface IAframeSceneHotspots extends IAframeSceneBase {
  type: EAframeSceneType.HOTSPOTS;
  data: IAframeSceneDataHotspots;
}

interface IAframeSceneMain extends IAframeSceneBase {
  type: EAframeSceneType.MAIN;
  data: IAframeSceneDataMain;
}

export type TAframeSceneDataAll = IAframeSceneDataHotspots & IAframeSceneDataMain;

export type TAframeScene = IAframeSceneHotspots | IAframeSceneMain;

export type TActiveAframeScene = IAframeSceneBase & {
  data: Omit<TAframeSceneDataAll, 'skybox'>
}

export interface IEditActiveAframeSceneProps<T extends EAframe3DObjectType = EAframe3DObjectType> {
  id: I3DObject['id'];
  type: T;
  data:
      T extends EAframe3DObjectType.HOTSPOT ? Partial<THotspotChangeableData> :
      T extends EAframe3DObjectType.PORTAL ? Partial<TPortalChangeableData> : never
}
