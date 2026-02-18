import { defineStore } from 'pinia';
import type { Raw } from 'vue';
import { EScreenName } from '~/types/screen';
import screenStart from '~/components/start-screen/screen-start-component.vue';

interface State {
  appState: string;
  debug: boolean;
  isLandscape: boolean;
  windowFocused: boolean;
  isInstructionViewed: boolean;
  screen: Raw<object> | null;
  screenName: EScreenName;
  muted: boolean;
}

interface Actions {
  setAppState(state: string): void;
  setDebug(debug: boolean): void;
  setIsLandscape(isLandScape: boolean): void;
  setWindowFocused(value: boolean): void;
  setIsInstructionViewed: (isViewed: boolean) => void;
  setScreen<T extends object>(screen: T | null): void;
  setScreenName(screenName: EScreenName): void;
  toggleMuted(): void;
}

export const useAppStore = defineStore<'app', State, {}, Actions>('app', {
  state: () => ({
    appState: 'splash',
    debug: false,
    isLandscape: false,
    windowFocused: true,
    isInstructionViewed: false,
    screenName: EScreenName.START,
    screen: markRaw(screenStart),
    muted: false
  }),
  actions: {
    setAppState(state) {
      this.appState = state;
    },
    setDebug(debug) {
      this.debug = debug;
    },
    setIsLandscape(isLandScape) {
      this.isLandscape = isLandScape;
    },
    setWindowFocused(value) {
      this.windowFocused = value;
    },
    setIsInstructionViewed(value) {
      this.isInstructionViewed = value;
    },
    setScreen(screen) {
      if (!screen) {
        this.screen = null;
        return;
      }

      this.screen = markRaw(screen);
    },
    setScreenName(screenName) {
      const aframeStore = useAframeStore();

      this.screenName = screenName;
      aframeStore.setActiveSceneData();
    },
    toggleMuted() {
      this.muted = !this.muted;
    }
  }
});
