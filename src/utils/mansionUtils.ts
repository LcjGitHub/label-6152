import Fuse from 'fuse.js';
import type { LunarMansion } from '@/types/lunarMansion';

/**
 * 构建二十八宿模糊搜索实例
 * @param mansions - 二十八宿列表
 */
export function createMansionFuse(mansions: LunarMansion[]): Fuse<LunarMansion> {
  return new Fuse(mansions, {
    keys: ['name', 'pinyin', 'direction', 'summary', 'description', 'symbol'],
    threshold: 0.3,
    minMatchCharLength: 1,
  });
}

/**
 * 执行搜索并返回二十八宿列表
 * @param mansions - 完整二十八宿列表
 * @param fuse - Fuse 实例
 * @param query - 搜索关键词
 */
export function searchMansions(
  mansions: LunarMansion[],
  fuse: Fuse<LunarMansion>,
  query: string,
): LunarMansion[] {
  const trimmed = query.trim();
  if (!trimmed) return mansions;
  return fuse.search(trimmed).map((r) => r.item);
}
