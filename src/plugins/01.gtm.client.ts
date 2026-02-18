/* eslint-disable no-undef */
import { createGtm } from '@gtm-support/vue-gtm';
import { useRuntimeConfig } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  if (config.public.gtmId) {
    nuxtApp.vueApp.use(
      createGtm({
        id: config.public.gtmId,
        defer: false,
        debug: false,
        compatibility: false,
        enabled: true,
        vueRouter: useRouter(),
        loadScript: true
      })
    );
  }
});
