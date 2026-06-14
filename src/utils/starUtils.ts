import Fuse from 'fuse.js';
import type { Star } from '@/types/star';

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
