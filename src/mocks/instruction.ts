import lookIcon from '~/assets/images/look-around.gif';
import swipeIcon from '~/assets/images/swipe-around.gif';
import { type GameInstructions, InstructionName } from '~/types/instruction';

export const GAME_INSTRUCTIONS: GameInstructions = {
  [InstructionName.LOOK]: {
    id: '1',
    name: InstructionName.LOOK,
    icon: lookIcon,
    text: 'Look around the rainforest & tap on a doorway to explore',
    width: 190
  },
  [InstructionName.SWIPE]: {
    id: '2',
    name: InstructionName.SWIPE,
    icon: swipeIcon,
    text: 'Look around and select an area to explore',
    width: 135
  }
};
