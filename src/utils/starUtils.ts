import Fuse from 'fuse.js';
import type { Star } from '@/types/star';

export type SortBy = 'default' | 'magnitude-asc' | 'magnitude-desc';

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'default', label: '默认顺序' },
  { value: 'magnitude-asc', label: '视星等由亮到暗' },
  { value: 'magnitude-desc', label: '视星等由暗到亮' },
];

export interface LegendItem {
  id: string;
  title: string;
  description: string;
}

export interface LegendCategory {
  id: string;
  title: string;
  intro?: string;
  items: LegendItem[];
}

export const LEGEND_DATA: LegendCategory[] = [
  {
    id: 'enclosures',
    title: '三垣区域',
    intro: '画布中的半透明矩形与边框代表三垣天区的范围示意，并非精确的天区边界。',
    items: [
      {
        id: 'ziwei',
        title: '紫微垣',
        description: '北天中央的天区，又称紫宫，是天帝居住的地方，象征皇宫。',
      },
      {
        id: 'taiwei',
        title: '太微垣',
        description: '紫微垣下的天区，象征朝廷，是政府官员所在的地方。',
      },
      {
        id: 'tianshi',
        title: '天市垣',
        description: '位于南天的天区，象征街市，是天子率诸侯行幸的都市。',
      },
    ],
  },
  {
    id: 'starMagnitude',
    title: '星点大小',
    items: [
      {
        id: 'magnitude',
        title: '视星等',
        description: '星点大小代表视星等，数值越小星星越亮，星点也越大。视星等每相差 1 等，亮度相差约 2.512 倍。',
      },
    ],
  },
  {
    id: 'background',
    title: '背景装饰',
    items: [
      {
        id: 'decorative',
        title: '背景散点',
        description: '背景中的浅色小点仅为装饰效果，用于增强星图氛围感，不对应具体的星官或恒星。',
      },
    ],
  },
];

/**
 * 构建星官模糊搜索实例
 * @param stars - 星官列表
 */
export function createStarFuse(stars: Star[]): Fuse<Star> {
  return new Fuse(stars, {
    keys: [
      { name: 'name', weight: 0.5 },
      { name: 'enclosure', weight: 0.3 },
      { name: 'summary', weight: 0.2 },
    ],
    threshold: 0.4,
    includeScore: true,
  });
}

/**
 * 执行搜索并返回星官列表
 * @param stars - 完整星官列表
 * @param fuse - Fuse 实例
 * @param query - 搜索关键词
 */
export function searchStars(stars: Star[], fuse: Fuse<Star>, query: string): Star[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return stars;
  }
  return fuse.search(trimmed).map((result) => result.item);
}

/**
 * 对星官列表按指定方式排序
 * @param stars - 待排序的星官列表
 * @param sortBy - 排序方式：default 保持原序，magnitude-asc 由亮到暗，magnitude-desc 由暗到亮
 */
export function sortStars(stars: Star[], sortBy: SortBy): Star[] {
  const copy = [...stars];
  switch (sortBy) {
    case 'magnitude-asc':
      return copy.sort((a, b) => a.magnitude - b.magnitude);
    case 'magnitude-desc':
      return copy.sort((a, b) => b.magnitude - a.magnitude);
    default:
      return copy;
  }
}

/**
 * 根据星等计算渲染半径
 * @param magnitude - 视星等
 */
export function magnitudeToRadius(magnitude: number): number {
  return Math.max(3, 8 - magnitude * 1.2);
}

/**
 * 根据百分比坐标计算 Canvas 像素位置
 * @param percent - 百分比 0–100
 * @param size - 画布宽或高
 */
export function percentToPixel(percent: number, size: number): number {
  return (percent / 100) * size;
}

/**
 * 检测点击是否命中星点
 * @param hitAreas - 可点击区域列表
 * @param px - 点击 x
 * @param py - 点击 y
 */
export function hitTestStar(
  hitAreas: { star: Star; cx: number; cy: number; radius: number }[],
  px: number,
  py: number,
): Star | null {
  for (let i = hitAreas.length - 1; i >= 0; i--) {
    const area = hitAreas[i];
    const dx = px - area.cx;
    const dy = py - area.cy;
    if (dx * dx + dy * dy <= area.radius * area.radius) {
      return area.star;
    }
  }
  return null;
}
