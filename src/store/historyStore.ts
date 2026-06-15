import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Star } from '@/types/star';

export interface HistoryItem {
  star: Star;
  visitedAt: number;
}

const MAX_HISTORY_ITEMS = 50;
const DEFAULT_RECENT_COUNT = 5;

interface HistoryState {
  historyItems: HistoryItem[];
  addHistory: (star: Star) => void;
  clearHistory: () => void;
  getRecentHistory: (count?: number) => HistoryItem[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      historyItems: [],
      addHistory: (star) => {
        const existing = get().historyItems.filter((item) => item.star.id !== star.id);
        const newItems = [{ star, visitedAt: Date.now() }, ...existing].slice(0, MAX_HISTORY_ITEMS);
        set({
          historyItems: newItems,
        });
      },
      clearHistory: () => {
        set({ historyItems: [] });
      },
      getRecentHistory: (count = DEFAULT_RECENT_COUNT) => {
        return get().historyItems.slice(0, count);
      },
    }),
    {
      name: 'star-history',
    },
  ),
);
