import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FavoriteType = 'starOfficer' | 'lunarMansion';

interface FavoriteState {
  starOfficerFavorites: string[];
  lunarMansionFavorites: string[];
  addFavorite: (id: string, type: FavoriteType) => void;
  removeFavorite: (id: string, type: FavoriteType) => void;
  toggleFavorite: (id: string, type: FavoriteType) => void;
  isFavorite: (id: string, type: FavoriteType) => boolean;
}

/**
 * 迁移旧版收藏数据（仅包含星官ID的扁平数组）到新版分类型结构
 */
function migrateLegacyData(
  persistedState: unknown,
): Partial<FavoriteState> | undefined {
  if (!persistedState || typeof persistedState !== 'object') return undefined;

  const state = persistedState as Record<string, unknown>;

  if (Array.isArray(state.favoriteIds)) {
    return {
      starOfficerFavorites: state.favoriteIds as string[],
      lunarMansionFavorites: [],
    };
  }

  return undefined;
}

/**
 * 收藏状态管理，使用 localStorage 持久化
 * 区分星官(starOfficer)与星宿(lunarMansion)两种收藏类型
 */
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      starOfficerFavorites: [],
      lunarMansionFavorites: [],
      addFavorite: (id, type) => {
        set((state) => {
          const key = type === 'starOfficer' ? 'starOfficerFavorites' : 'lunarMansionFavorites';
          const currentList = state[key];
          if (currentList.includes(id)) return {};
          return { [key]: [...currentList, id] };
        });
      },
      removeFavorite: (id, type) => {
        set((state) => {
          const key = type === 'starOfficer' ? 'starOfficerFavorites' : 'lunarMansionFavorites';
          return {
            [key]: state[key].filter((fid) => fid !== id),
          };
        });
      },
      toggleFavorite: (id, type) => {
        const isFav = get().isFavorite(id, type);
        if (isFav) {
          get().removeFavorite(id, type);
        } else {
          get().addFavorite(id, type);
        }
      },
      isFavorite: (id, type) => {
        const key = type === 'starOfficer' ? 'starOfficerFavorites' : 'lunarMansionFavorites';
        return get()[key].includes(id);
      },
    }),
    {
      name: 'star-favorites',
      migrate: migrateLegacyData,
    },
  ),
);
