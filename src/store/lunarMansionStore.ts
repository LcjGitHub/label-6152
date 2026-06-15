import { create } from 'zustand';
import type { LunarMansion, MansionGroup } from '@/types/lunarMansion';
import mansionData from '@/mock/lunarMansions.json';

interface MansionCatalogData {
  groups: MansionGroup[];
}

const catalog = mansionData as MansionCatalogData;

interface LunarMansionState {
  groups: MansionGroup[];
  mansions: LunarMansion[];
  selectedMansion: LunarMansion | null;
  drawerOpen: boolean;
  selectMansion: (mansion: LunarMansion | null) => void;
  openDrawer: (mansion: LunarMansion) => void;
  closeDrawer: () => void;
  getMansionsByDirection: (direction: string) => LunarMansion[];
}

export const useLunarMansionStore = create<LunarMansionState>((set, get) => ({
  groups: catalog.groups,
  mansions: catalog.groups.flatMap((g) => g.mansions),
  selectedMansion: null,
  drawerOpen: false,
  selectMansion: (mansion) => set({ selectedMansion: mansion }),
  openDrawer: (mansion) => set({ selectedMansion: mansion, drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  getMansionsByDirection: (direction) => {
    const group = get().groups.find((g) => g.direction === direction);
    return group?.mansions ?? [];
  },
}));
