/* eslint-disable no-undef */
import UserbackPlugin from '@userback/vue';
import { useRuntimeConfig } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  if (config.public.userbackToken) {
    nuxtApp.vueApp.use(UserbackPlugin, { token: config.public.userbackToken });
  }
});
