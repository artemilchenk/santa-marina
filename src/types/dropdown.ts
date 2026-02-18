import { EScreenName } from '~/types/screen';

export type TDropdownOptionData = {
  id: string;
  title: string;
  value: EScreenName;
}

export type TDropDataScreen = TDropdownOptionData[];
