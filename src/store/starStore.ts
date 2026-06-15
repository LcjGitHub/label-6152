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
  /** 待定位星官 ID（从列表页跳转星图页时设置，星图页消费后清空） */
  pendingLocateStarId: string | null;
  selectStar: (star: Star | null) => void;
  openDrawer: (star: Star) => void;
  closeDrawer: () => void;
  /**
   * 设置待定位星官 ID，供星图页读取并高亮定位
   * @param id - 目标星官 ID，传 null 可手动清空
   */
  setPendingLocateStarId: (id: string | null) => void;
  /**
   * 消费并清空待定位星官 ID，星图页完成自动定位后调用
   */
  clearPendingLocateStarId: () => void;
  getStarsByEnclosure: (enclosureId: string) => Star[];
  getStarCountByEnclosure: (enclosureId: string) => number;
}

/**
 * 全局星官状态
 */
export const useStarStore = create<StarState>((set, get) => ({
  stars: catalog.stars,
  enclosures: catalog.enclosures,
  selectedStar: null,
  drawerOpen: false,
  pendingLocateStarId: null,
  selectStar: (star) => set({ selectedStar: star }),
  openDrawer: (star) => set({ selectedStar: star, drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  setPendingLocateStarId: (id) => set({ pendingLocateStarId: id }),
  clearPendingLocateStarId: () => set({ pendingLocateStarId: null }),
  getStarsByEnclosure: (enclosureId) => {
    return get().stars.filter((star) => star.enclosureId === enclosureId);
  },
  getStarCountByEnclosure: (enclosureId) => {
    return get().stars.filter((star) => star.enclosureId === enclosureId).length;
  },
}));
