
export enum ModuleType {
  BRUSH = '笔',
  INK = '墨',
  PAPER = '纸',
  COLOR = '色',
  MISC = '其他'
}

export enum StepType {
  START = '起点',
  PROPERTY = '精进', // Purchasable Property
  CHANCE = '机遇', // Chance
  CHEST = '挑战', // Community Chest
  TAX = '税务',
  JAIL = '入狱',
  REST = '小憩', // Free Parking
  GO_TO_JAIL = '面壁'
}

export interface GameStep {
  id: number;
  type: StepType;
  module: ModuleType;
  taskType: string; // Name on the board
  taskContent: string;
  action: string;
  description: string;
  
  // Economy
  price: number; // Cost to master (buy)
  rent: number;  // Consultation fee (rent)
  baseRent: number;
  
  // State
  owner: 'player' | null;
  upgradeLevel: number; // 0 = owned, 1-3 = Bamboo Slips, 4 = Seal
  
  isReward: boolean; // Special marker
  gridIndex?: number;
}

export interface PlayerState {
  currentPosition: number;
  completedSteps: number[]; // IDs of owned properties
  completedImages: Record<number, string>;
  isMoving: boolean;
  diceValue: number | null;
  coins: number;
  inJail: boolean;
}

export interface PaintingState {
  brushProgress: number;
  inkProgress: number;
  colorProgress: number;
  totalProgress: number;
}
