import type { I3DObject, T3DObjectChangeableData } from '~/types/aframe-scene';

export enum EHotspotContentType {
  COMMON = 'common',
  VIDEO = 'video'
}

export enum EHotspotContentMediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

export enum EHotspotType {
  INFO = 'info',
  QUESTION = 'question'
}

interface IHotspotContentMedia {
  type: EHotspotContentMediaType;
  src: string;
}

interface IHotspotContentDataVideo {
  video: string;
  title: string;
}

interface IHotspotContentDataCommon {
  media?: IHotspotContentMedia;
  title: string;
  description?: string;
}

interface IHotspotContentBase {
  type: EHotspotContentType;
}

export interface IHotspotContentVideo extends IHotspotContentBase {
  type: EHotspotContentType.VIDEO;
  data: IHotspotContentDataVideo;
}

export interface IHotspotContentCommon extends IHotspotContentBase {
  type: EHotspotContentType.COMMON;
  data: IHotspotContentDataCommon;
}

export type THotspotContent = IHotspotContentVideo | IHotspotContentCommon;

export interface IHotspot extends Omit<I3DObject, 'asset'> {
  isChecked: boolean;
  isActive: boolean;
  type: EHotspotType;
  content: THotspotContent;
}

export type THotspotChangeableData = T3DObjectChangeableData & Pick<IHotspot, 'isChecked' | 'isActive' | 'type'>;
