import type { EScreenName } from '~/types/screen';
import type { ICoordinates } from './aframe-scene';

export interface IAsset {
  src: string;
}

export interface ISkyboxAsset extends IAsset {
  src: string;
  rotation: ICoordinates;
}

export interface ISoundAsset extends IAsset {
  loop: boolean;
}

export interface ISkybox {
  image: ISkyboxAsset;
  video: ISkyboxAsset;
  audio: ISoundAsset;
}

export interface ISkyboxVideoData {
  name: EScreenName,
  data: ISkyboxAsset;
}

export interface ILoadedSkyboxVideo {
  src: string | null;
  rotation: ICoordinates;
  name: EScreenName,
  isLoaded: boolean;
  hasError: boolean;
}
