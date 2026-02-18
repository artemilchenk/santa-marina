import { type Ref } from 'vue';
import { TRANSITION_DURATION } from '~/constants/transition';

interface IActionPlayProps {
  isReversed?: boolean;
  isImmediately?: boolean;
  hasTransitionScreen?: boolean;
  onStarted?: (() => void) | null;
  onFinished?: (() => void) | null;
}

interface IState {
  target: Ref<1 | 0>;
  duration: Ref<number>;
  isInProgress: Ref<boolean>;
  isReversed: Ref<boolean>;
  isTransitionScreenVisible: Ref<boolean>;
  onStartedCallback: Ref<(() => void) | null>;
  onFinishedCallback: Ref<(() => void) | null>;
}

interface IActions {
  setTarget: (value: 1 | 0) => void;
  resetTargetImmediately: (value: 1 | 0) => void;
  setIsReversed: (value: boolean) => void;
  setIsTransitionScreenVisible: (value: boolean) => void;
  setOnStartedCallback: (callback: (() => void) | null) => void;
  setOnFinishedCallback: (callback: (() => void) | null) => void;
  play: (props: IActionPlayProps) => void;
}

export const useTransitionStore = defineStore('transition-store', () => {
  const aframeStore = useAframeStore();

  const target = ref(0);
  const duration = ref(TRANSITION_DURATION);
  const isInProgress: IState['isInProgress'] = ref(false);
  const isReversed: IState['isReversed'] = ref(false);
  const isTransitionScreenVisible: IState['isTransitionScreenVisible'] = ref(false);
  const onFinishedCallback: IState['onFinishedCallback'] = ref(null);
  const onStartedCallback: IState['onStartedCallback'] = ref(null);

  const progress = useTransition(target, {
    duration,
    onStarted: () => {
      isInProgress.value = true;

      aframeStore.updateMtxDisplacementPos(true);

      if (onStartedCallback.value) {
        onStartedCallback.value();
      }
    },
    onFinished: () => {
      isInProgress.value = false;

      aframeStore.updateMtxDisplacementPos();

      if (onFinishedCallback.value) {
        onFinishedCallback.value();
      }
    }
  });

  const setTarget: IActions['setTarget'] = (value) => {
    isReversed.value = value === 0;
    target.value = value;
  };

  const setIsReversed: IActions['setIsReversed'] = (value) => {
    isReversed.value = value;
  };

  const setIsTransitionScreenVisible: IActions['setIsTransitionScreenVisible'] = (value) => {
    isTransitionScreenVisible.value = value;
  };

  const setOnStartedCallback: IActions['setOnStartedCallback'] = (callback) => {
    onStartedCallback.value = callback;
  };

  const setOnFinishedCallback: IActions['setOnFinishedCallback'] = (callback) => {
    onFinishedCallback.value = callback;
  };

  const resetTargetImmediately: IActions['setTarget'] = (value) => {
    duration.value = 0;

    setIsTransitionScreenVisible(false);

    isReversed.value = value === 0;
    target.value = value;

    setOnStartedCallback(null);

    setOnFinishedCallback(() => {
      duration.value = TRANSITION_DURATION;
    });
  };

  const play: IActions['play'] = ({
    isReversed = false,
    isImmediately = false,
    hasTransitionScreen = true,
    onFinished = null,
    onStarted = null
  }) => {
    setTarget(isReversed ? 0 : 1);
    setOnStartedCallback(onStarted);
    setOnFinishedCallback(() => {
      if (onFinished) {
        onFinished();
      }

      if (isImmediately) {
        resetTargetImmediately(isReversed ? 1 : 0);
      }
    });

    setIsTransitionScreenVisible(hasTransitionScreen);
  };

  return {
    target,
    duration,
    progress,
    isInProgress,
    isReversed,
    isTransitionScreenVisible,
    onStartedCallback,
    setTarget,
    resetTargetImmediately,
    setIsReversed,
    setIsTransitionScreenVisible,
    setOnStartedCallback,
    setOnFinishedCallback,
    play
  };
});
