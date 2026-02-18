import type { EffectSound } from '~/types/sound';
import { ESoundEffectName, ESoundType } from '~/types/sound';

import UITap from '~/assets/sounds/ui-tap.mp3';
import HotspotTap from '~/assets/sounds/hotspot-tap.mp3';
import PortalEnter from '~/assets/sounds/portal-entry.mp3';

export const EFFECT_SOUNDS: EffectSound[] = [
  {
    id: ESoundEffectName.uiTap,
    type: ESoundType.effect,
    src: UITap
  },
  {
    id: ESoundEffectName.hotspotTap,
    type: ESoundType.effect,
    src: HotspotTap
  },
  {
    id: ESoundEffectName.portalEnter,
    type: ESoundType.effect,
    src: PortalEnter
  }
];
