import { Howl, Howler } from 'howler';
import { type AmbienceSound, type EffectSound, ESoundEffectName, ESoundType } from '~/types/sound';
import { EScreenName } from '~/types/screen';
import { isAmbientSound, isEffectSound } from '~/utils/type-guards';

export class SoundService {
  private ambiences: Record<string, Howl>;
  private effects: Record<string, Howl>;
  private activeEnvironment: Howl | null;
  private activeEffect: Howl | null;

  constructor() {
    this.ambiences = {};
    this.effects = {};
    this.activeEnvironment = null;
    this.activeEffect = null;
  }

  public preloadSounds(sounds: (EffectSound | AmbienceSound)[]) {
    sounds.forEach((sound) => {
      const loop = sound.type === ESoundType.ambience ? sound.loop : false;
      const howl = new Howl({
        src: [sound.src],
        preload: true,
        html5: false,
        volume: 0.5,
        loop
      });

      if (sound.type === ESoundType.ambience) {
        this.ambiences[sound.id] = howl;
      } else {
        this.effects[sound.id] = howl;
      }
    });
  }

  public play(id: EScreenName | ESoundEffectName, onEnd: () => void = () => {}) {
    const active = isEffectSound(id) ? this.activeEffect : this.activeEnvironment;

    if (active) {
      active.stop();
      active.off('end');
    }

    if (isEffectSound(id)) {
      this.activeEffect = this.effects[id];
      this.activeEffect.once('end', onEnd);
      this.activeEffect.play();
    } else if (isAmbientSound(id)) {
      this.activeEnvironment = this.ambiences[id];
      this.activeEnvironment.once('end', onEnd);
      this.activeEnvironment.play();
    }
  }

  public stop(type?: ESoundType) {
    switch (type) {
      case ESoundType.ambience:
        this.activeEnvironment?.stop();
        break;
      case ESoundType.effect:
        this.activeEffect?.stop();
        break;
      default:
        this.activeEnvironment?.stop();
        this.activeEffect?.stop();
    }
  }

  public resume() {
    if (!this.activeEnvironment?.playing()) {
      this.activeEnvironment?.play();
    }
  }

  public mute(value: boolean) {
    Howler.mute(value);

    if (!value) {
      this.resume();
    }
  }
}
