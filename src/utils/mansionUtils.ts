import Fuse from 'fuse.js';
import type { LunarMansion } from '@/types/lunarMansion';

export function createMansionFuse(mansions: LunarMansion[]): Fuse<LunarMansion> {
  return new Fuse(mansions, {
    keys: ['name', 'pinyin', 'direction', 'summary', 'description', 'symbol'],
    threshold: 0.3,
    minMatchCharLength: 1,
  });
}

export function searchMansions(
  mansions: LunarMansion[],
  fuse: Fuse<LunarMansion>,
  query: string,
): LunarMansion[] {
  const trimmed = query.trim();
  if (!trimmed) return mansions;
  return fuse.search(trimmed).map((r) => r.item);
}
