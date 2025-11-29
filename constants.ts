
import { GameStep, ModuleType, StepType } from './types';

// Total 36 steps (10x10 grid perimeter)
export const TOTAL_STEPS = 36;

// COLORS for Modules - SOFTER PASTEL PALETTE (Macaron Colors)
export const MODULE_COLORS = {
  [ModuleType.BRUSH]: '#6EE7B7', // Pastel Mint/Emerald
  [ModuleType.INK]: '#93C5FD',   // Pastel Blue (Soft Sky)
  [ModuleType.PAPER]: '#FDBA74', // Pastel Orange/Apricot
  [ModuleType.COLOR]: '#F9A8D4', // Pastel Pink/Rose
  [ModuleType.MISC]: '#A7DBF8'   // Background Blue
};

// Chance / Chest Colors (Matching Paper Orange and Ink Blue)
export const CARD_COLORS = {
  CHANCE: '#FDBA74', // Matches Paper (Orange)
  CHEST: '#93C5FD',  // Matches Ink (Blue)
};

const BASE_PROPS = [
  // BRUSH (5 Props) - Cyan/Mint
  { id: 1, module: ModuleType.BRUSH, name: '五指执笔', price: 60, rent: 2, desc: '按实掌虚，五指齐力' },
  { id: 2, module: ModuleType.BRUSH, name: '三指执笔', price: 60, rent: 4, desc: '拇指食指捏，中指托' },
  { id: 3, module: ModuleType.BRUSH, name: '中锋侧锋', price: 100, rent: 6, desc: '中锋圆润，侧锋险劲' },
  { id: 4, module: ModuleType.BRUSH, name: '藏锋露锋', price: 100, rent: 6, desc: '欲右先左，精神外露' },
  { id: 5, module: ModuleType.BRUSH, name: '提按顿挫', price: 120, rent: 8, desc: '提则细，按则粗' },

  // INK (5 Props) - Blue
  { id: 6, module: ModuleType.INK, name: '焦墨', price: 140, rent: 10, desc: '黑如漆，定骨架' },
  { id: 7, module: ModuleType.INK, name: '浓墨', price: 140, rent: 10, desc: '少水多墨，神采焕发' },
  { id: 8, module: ModuleType.INK, name: '重墨', price: 160, rent: 12, desc: '介于浓淡之间' },
  { id: 9, module: ModuleType.INK, name: '淡墨', price: 160, rent: 12, desc: '水多墨少，清淡素雅' },
  { id: 10, module: ModuleType.INK, name: '清墨', price: 180, rent: 14, desc: '极淡之墨，似有若无' },

  // PAPER (5 Props) - Orange/Apricot
  { id: 11, module: ModuleType.PAPER, name: '生宣特性', price: 200, rent: 16, desc: '吸水晕化快，适合写意' },
  { id: 12, module: ModuleType.PAPER, name: '熟宣特性', price: 200, rent: 16, desc: '不吸水，适合工笔' },
  { id: 13, module: ModuleType.PAPER, name: '半熟宣', price: 220, rent: 18, desc: '半生半熟，兼具两者' },
  { id: 14, module: ModuleType.PAPER, name: '洒金宣', price: 220, rent: 18, desc: '装饰性强，富丽堂皇' },
  { id: 15, module: ModuleType.PAPER, name: '皮纸', price: 240, rent: 20, desc: '纤维长，拉力强' },

  // COLOR (4 Props) - Pink/Rose
  { id: 16, module: ModuleType.COLOR, name: '原色认知', price: 260, rent: 22, desc: '熟悉颜料本色' },
  { id: 17, module: ModuleType.COLOR, name: '草木之绿', price: 260, rent: 22, desc: '藤黄+花青' },
  { id: 18, module: ModuleType.COLOR, name: '青山黛紫', price: 280, rent: 24, desc: '胭脂+花青' },
  { id: 19, module: ModuleType.COLOR, name: '金碧山水', price: 300, rent: 26, desc: '石青+石绿' },
];

// Helper to create empty/action steps
const createAction = (index: number, type: StepType, name: string, price = 0) => ({
  id: -1 * index, // negative ID for non-properties
  type,
  module: ModuleType.MISC,
  taskType: name,
  taskContent: name,
  action: type === StepType.TAX ? '支付启蒙币' : '抽取卡片',
  description: '',
  price,
  rent: 0,
  baseRent: 0,
  owner: null,
  upgradeLevel: 0,
  isReward: false,
  gridIndex: index
});

const createProp = (index: number, refId: number) => {
  const data = BASE_PROPS.find(p => p.id === refId)!;
  return {
    id: data.id,
    type: StepType.PROPERTY,
    module: data.module,
    taskType: data.name,
    taskContent: `习得技能：${data.name}`,
    action: '完成练习并打卡',
    description: data.desc,
    price: data.price,
    rent: data.rent,
    baseRent: data.rent,
    owner: null as 'player' | null,
    upgradeLevel: 0,
    isReward: false,
    gridIndex: index
  };
};

// 36 Steps Mapping
// Bottom: 0-9 (Right to Left) -> 0=Start
// Left: 10-18 (Bottom to Top) -> 9=Jail
// Top: 19-27 (Left to Right) -> 18=Free Parking
// Right: 28-35 (Top to Bottom) -> 27=Go To Jail

export const GAME_STEPS: GameStep[] = new Array(TOTAL_STEPS).fill(null);

// CORNERS - UPDATED TO POSITIVE THEMES
GAME_STEPS[0] = createAction(0, StepType.START, '每日起笔'); // GO
GAME_STEPS[9] = createAction(9, StepType.JAIL, '静心沉淀'); // Was Jail
GAME_STEPS[18] = createAction(18, StepType.REST, '闲云野鹤'); // Free Parking
GAME_STEPS[27] = createAction(27, StepType.GO_TO_JAIL, '游历采风'); // Was GoToJail

// BOTTOM ROW (Indices 1-8) - Mixed Brush & Action
GAME_STEPS[1] = createProp(1, 1); // Brush 1
GAME_STEPS[2] = createAction(2, StepType.CHEST, '妙悟'); // Chest (Challenge)
GAME_STEPS[3] = createProp(3, 2); // Brush 2
GAME_STEPS[4] = createAction(4, StepType.TAX, '纸墨耗损', 100); // Tax
GAME_STEPS[5] = createProp(5, 3); // Brush 3
GAME_STEPS[6] = createProp(6, 4); // Brush 4
GAME_STEPS[7] = createAction(7, StepType.CHANCE, '机遇'); // Chance
GAME_STEPS[8] = createProp(8, 5); // Brush 5

// LEFT ROW (Indices 10-17) - Ink
GAME_STEPS[10] = createProp(10, 6); // Ink 1
GAME_STEPS[11] = createAction(11, StepType.CHEST, '妙悟');
GAME_STEPS[12] = createProp(12, 7); // Ink 2
GAME_STEPS[13] = createProp(13, 8); // Ink 3
GAME_STEPS[14] = createAction(14, StepType.TAX, '笔锋折损', 50);
GAME_STEPS[15] = createProp(15, 9); // Ink 4
GAME_STEPS[16] = createAction(16, StepType.CHANCE, '机遇');
GAME_STEPS[17] = createProp(17, 10); // Ink 5

// TOP ROW (Indices 19-26) - Paper
GAME_STEPS[19] = createProp(19, 11); // Paper 1
GAME_STEPS[20] = createAction(20, StepType.CHEST, '妙悟');
GAME_STEPS[21] = createProp(21, 12); // Paper 2
GAME_STEPS[22] = createProp(22, 13); // Paper 3
GAME_STEPS[23] = createProp(23, 14); // Paper 4
GAME_STEPS[24] = createAction(24, StepType.CHANCE, '机遇');
GAME_STEPS[25] = createProp(25, 15); // Paper 5
GAME_STEPS[26] = createAction(26, StepType.TAX, '文房维护', 150);

// RIGHT ROW (Indices 28-35) - Color
GAME_STEPS[28] = createProp(28, 16); // Color 1
GAME_STEPS[29] = createAction(29, StepType.CHEST, '妙悟');
GAME_STEPS[30] = createProp(30, 17); // Color 2
GAME_STEPS[31] = createAction(31, StepType.CHANCE, '机遇');
GAME_STEPS[32] = createProp(32, 18); // Color 3
GAME_STEPS[33] = createAction(33, StepType.TAX, '颜料补充', 75);
GAME_STEPS[34] = createProp(34, 19); // Color 4
GAME_STEPS[35] = createAction(35, StepType.CHANCE, '机遇'); // Chance
