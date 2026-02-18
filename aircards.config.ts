export type TAircardsConfig = {
  USE_SERVER: boolean
  USE_XRWEB: boolean
  XRWEB_APPKEY: string
  PROJECT_TITLE: string
  NUXT_APP_CDN_URL?: string
  METALITIX_DEVELOPMENT_APP_KEY?: string
  METALITIX_STAGING_APP_KEY?: string
  METALITIX_PRODUCTION_APP_KEY?: string
  GTM_ID?: string
  USERBACK_TOKEN?: string
  FALLBACK_LOCALE: string
}

// ADD YOUR PROJECT DETAILS BELOW

const AircardsConfig: TAircardsConfig = {
  USE_SERVER: false, // set to true to enable SSR, set to false to statically generate the site
  USE_XRWEB: false, // set to true to enable 8thwall plugin (requires setting the XRWEB_APPKEY param below)
  XRWEB_APPKEY: 'XYZ123', // set to your XRweb app key from 8thwall.com
  PROJECT_TITLE: 'Costa Rica Tourism', // set to your project title
  NUXT_APP_CDN_URL: undefined, // delete or set to undefined to load static assets from the same domain as the app
  METALITIX_DEVELOPMENT_APP_KEY: '7ab1cf98-8e92-4bcc-9f3a-0e38c1c39df0',
  METALITIX_STAGING_APP_KEY: '7ab1cf98-8e92-4bcc-9f3a-0e38c1c39df0',
  METALITIX_PRODUCTION_APP_KEY: '476dfe15-6c12-437f-b3b4-8b59309f067f',
  GTM_ID: 'GTM-XXXXXXX', // set to your Google Tag Manager ID from tagmanager.google.com
  USERBACK_TOKEN: '00000|00000|xyz123', // delete or set to undefined to disable Userback
  FALLBACK_LOCALE: 'en-us'
};

export default AircardsConfig;
