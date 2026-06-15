import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteState {
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

/**
 * 收藏状态管理，使用 localStorage 持久化
 */
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      addFavorite: (id) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds
            : [...state.favoriteIds, id],
        }));
      },
      removeFavorite: (id) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((fid) => fid !== id),
        }));
      },
      toggleFavorite: (id) => {
        const isFav = get().favoriteIds.includes(id);
        if (isFav) {
          get().removeFavorite(id);
        } else {
          get().addFavorite(id);
        }
      },
      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'star-favorites',
    },
  ),
);
