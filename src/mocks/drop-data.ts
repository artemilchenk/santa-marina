import { EScreenName } from '~/types/screen';
import type { TDropDataScreen } from '~/types/dropdown';

export const DROP_DATA: TDropDataScreen = [
  {
    id: '1',
    title: 'Rainforest',
    value: EScreenName.MAIN
  },
  {
    id: '2',
    title: 'Wellness',
    value: EScreenName.WELLNESS
  },
  {
    id: '3',
    title: 'Sustainability',
    value: EScreenName.SUSTAINABILITY
  },
  {
    id: '4',
    title: 'Adventure',
    value: EScreenName.ADVENTURE
  }
];
