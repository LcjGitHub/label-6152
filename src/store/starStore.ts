import { create } from 'zustand';
import type { Star, Enclosure } from '@/types/star';
import starData from '@/mock/stars.json';
import type { StarCatalogData } from '@/types/star';

const catalog = starData as StarCatalogData;

interface StarState {
  stars: Star[];
  enclosures: Enclosure[];
  selectedStar: Star | null;
  /** 列表页 Drawer 是否打开 */
  drawerOpen: boolean;
  selectStar: (star: Star | null) => void;
  openDrawer: (star: Star) => void;
  closeDrawer: () => void;
}

/**
 * 全局星官状态
 */
export const useStarStore = create<StarState>((set) => ({
  stars: catalog.stars,
  enclosures: catalog.enclosures,
  selectedStar: null,
  drawerOpen: false,
  selectStar: (star) => set({ selectedStar: star }),
  openDrawer: (star) => set({ selectedStar: star, drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
}));
