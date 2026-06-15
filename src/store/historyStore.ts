import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Star } from '@/types/star';

export interface HistoryItem {
  star: Star;
  visitedAt: number;
}

interface HistoryState {
  historyItems: HistoryItem[];
  addHistory: (star: Star) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      historyItems: [],
      addHistory: (star) => {
        const existing = get().historyItems.filter((item) => item.star.id !== star.id);
        set({
          historyItems: [{ star, visitedAt: Date.now() }, ...existing],
        });
      },
      clearHistory: () => {
        set({ historyItems: [] });
      },
    }),
    {
      name: 'star-history',
    },
  ),
);
