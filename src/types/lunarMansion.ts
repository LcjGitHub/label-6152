export type MansionDirection = '东方苍龙' | '北方玄武' | '西方白虎' | '南方朱雀';

export interface LunarMansion {
  id: string;
  name: string;
  pinyin: string;
  direction: MansionDirection;
  order: number;
  symbol: string;
  summary: string;
  description: string;
  stars: string[];
  bestSeason: string;
}

export interface MansionGroup {
  direction: MansionDirection;
  description: string;
  mansions: LunarMansion[];
}
