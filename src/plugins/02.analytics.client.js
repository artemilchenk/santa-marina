/* eslint-disable no-undef */
import { useGtm } from '@gtm-support/vue-gtm';

const gtm = useGtm();

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      analytics: (e) => {
        // handle metalitix logging
        const scene = document.querySelector('a-scene');
        const components = scene?.components;

        if (typeof components !== 'undefined' && typeof components['metalitix-logger'] !== 'undefined') {
          const { logger } = scene.components['metalitix-logger'];

          if (logger) {
            if (typeof e.event_action !== 'undefined') {
              // {
              //   event: 'avatar_selected',
              //   event_label: 'Avatar Selected',
              //   event_category: 'Avatar',
              //   event_action: 'avatar_1'
              // }
              logger.setCustomField(e.event, e.event_action);
            } else {
              // {
              //   event: 'page_mounted',
              //   event_label: 'Page Mounted',
              //   event_category: 'page lifecycle'
              // }
              const obj = {};
              obj[e.event_category] = e.event;
              obj[e.event] = 1;
              logger.logCustomEvent(e.event, obj);

              // logger.logCustomEvent('page_mounted', {
              //   page_lifecycle: 'page_mounted',
              //   page_mounted: 1
              // })
            }
          }
        } else {
          console.warn('event not logged by metalitix', e);
        }
        // handle google analytics
        if (gtm) {
          gtm.trackEvent(e);
        } else {
          window.dataLayer?.push(e);
        }
      }
    }
  };
});
