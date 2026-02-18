export enum InstructionName {
  LOOK = 'look',
  SWIPE = 'swipe'
}

export type GameInstruction = {
  id: string;
  name: InstructionName;
  icon: string;
  text: string;
  width: number;
};
export type GameInstructions = Record<InstructionName, GameInstruction>;
