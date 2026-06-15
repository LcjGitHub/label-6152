export type TermCategory = '三垣' | '二十八宿' | '星官体系' | '天文坐标' | '古代历法' | '星占术语';

export interface AstronomyTerm {
  id: string;
  name: string;
  category: TermCategory;
  summary: string;
  detail: string;
}

export interface CategoryInfo {
  name: TermCategory;
  description: string;
  colorScheme: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: '三垣',
    description: '中国古代将北天极附近分为三大星域，称为三垣，分别为紫微垣、太微垣、天市垣。',
    colorScheme: 'purple',
  },
  {
    name: '二十八宿',
    description: '古代天文学家把黄道和赤道附近的恒星分为二十八个星宿，用于观测日月五星运行。',
    colorScheme: 'blue',
  },
  {
    name: '星官体系',
    description: '中国古代恒星组织系统，将恒星分组为星官，类似西方星座概念。',
    colorScheme: 'cyan',
  },
  {
    name: '天文坐标',
    description: '中国古代天文学用于描述天体位置的坐标系统，包括赤道坐标、黄道坐标等。',
    colorScheme: 'green',
  },
  {
    name: '古代历法',
    description: '中国古代制定的历法体系，用于纪年、纪月、纪日及节气安排。',
    colorScheme: 'orange',
  },
  {
    name: '星占术语',
    description: '古代星占学中使用的专有名词，用于解释天象及其人事吉凶的对应关系。',
    colorScheme: 'red',
  },
];
