import AircardsConfig from '../../aircards.config';

export enum BuildType {
  DEV = 'development',
  STAGING = 'staging',
  PROD = 'production'
}

export const getBuildType = (): BuildType => {
  return process.env.NODE_ENV === BuildType.PROD && !window.location.hostname.endsWith('aircards.io')
    ? BuildType.PROD
    : process.env.NODE_ENV === BuildType.PROD
    ? BuildType.STAGING
    : BuildType.DEV;
};
