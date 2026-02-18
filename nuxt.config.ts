// https://nuxt.com/docs/api/configuration/nuxt-config
import certGen from './certgen';
import { resolve } from 'path';
import AircardsConfig from './aircards.config';

export default async () => {
  const useServer = AircardsConfig.USE_SERVER;
  const isProductionEnv = process.env.NODE_ENV === 'production';
  const isDevelopmentEnv = process.env.NODE_ENV === 'development';

  const devHttps = {
    key: '',
    cert: ''
  };

  if (process.env.NODE_ENV === 'development') {
    const { devServerKey, devServerCert } = await certGen('./certs/aircards.key', './certs/aircards.crt');
    devHttps.key = devServerKey;
    devHttps.cert = devServerCert;
  }

  return {
    typescript: {
      shim: false
    },
    ssr: useServer,
    builder: 'webpack',
    vue: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('a-') || tag.startsWith('xrextras-') || tag.startsWith('lottie-player')
      }
    },
    useRuntimeConfig: true,
    runtimeConfig: {
      public: {
        isProductionEnv,
        isDevelopmentEnv,
        xrwebAppKey: AircardsConfig.XRWEB_APPKEY,
        metalitixAppKey: AircardsConfig.METALITIX_DEVELOPMENT_APP_KEY,
        gtmId: AircardsConfig.GTM_ID,
        userbackToken: AircardsConfig.USERBACK_TOKEN,
        fallbackLocale: AircardsConfig.FALLBACK_LOCALE
      }
    },
    css: ['~/assets/styles/main.scss'],
    styleResources: {
      scss: ['./assets/styles/_fonts.scss', './assets/styles/utils/index.scss']
    },
    devServer: {
      https: devHttps,
      port: '3007',
      host: 'https://192.168.31.226'
    },
    rootDir: resolve('./src'),
    app: {
      head: {
        noscript: [
          {
            children: `<iframe src="https://www.googletagmanager.com/ns.html?id=${AircardsConfig.GTM_ID}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            body: true
          }
        ],
        script: [
          { src: 'https://aframe.io/releases/1.6.0/aframe.min.js' },
          { src: 'https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js' },
          { src: 'https://unpkg.com/@tweenjs/tween.js@^20.0.0/dist/tween.umd.js' },
          { src: 'https://cdn.jsdelivr.net/gh/c-frame/aframe-physics-system@v4.2.2/dist/aframe-physics-system.min.js' },
          {
            hid: 'gtm',
            children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${AircardsConfig.GTM_ID}');`,
            type: 'text/javascript'
          }
        ],
        title: AircardsConfig.PROJECT_TITLE,
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
      },
      cdnUrl: AircardsConfig.NUXT_APP_CDN_URL || undefined
    },
    hooks: {
      'webpack:config'(configs) {
        const clientConfig = configs.find((config) => config.name === 'client');
        if (!clientConfig || !clientConfig.module || !clientConfig.module.rules) return;

        const defaultImageRule = clientConfig.module.rules.find((rule) => rule.test.toString().includes('jpe?g'));
        clientConfig.module.rules[clientConfig.module.rules.indexOf(defaultImageRule)].exclude = /models/;

        clientConfig.module.rules.unshift(
          {
            test: /\.(ogg|mp3|wav|mpe?g)$/i,
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          },
          {
            test: /\.gltf$/,
            loader: resolve('./gltf-loader/'),
            options: {
              esModule: false,
              outputPath: '/assets/models',
              publicPath: '_nuxt/assets/models/'
            }
          },
          {
            test: /models.*\.(bin|png|jpe?g|gif|webm)$/,
            loader: 'file-loader',
            options: {
              esModule: false,
              outputPath: '/assets/models/gltf-assets',
              publicPath: '../models/gltf-assets/'
            }
          },
          {
            test: /models.*\.(glb)$/,
            loader: 'file-loader',
            options: {
              esModule: false,
              outputPath: '/assets/models',
              publicPath: '_nuxt/assets/models/'
            }
          }
        );
      }
    },
    webpack: {
      terser: {
        terserOptions: {
          compress: {
            drop_console: isProductionEnv
          }
        }
      }
    },
    sound: {
      sounds: {
        scan: true
      }
    },
    modules: [
      // ...
      '@pinia/nuxt',
      '@vueuse/nuxt',
      '@nuxtjs/style-resources'
    ],
    nitro: {
      preset: 'aws-lambda'
    }
  };
};
