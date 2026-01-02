import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { HourCard } from '@/data/hours';

export type SpreadType = 'single' | 'three' | 'five';

export interface DrawnCard extends HourCard {
  isReversed: boolean;
  positionName: string;
  positionDescription: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  question: string;
  spread: SpreadType;
  cards: DrawnCard[];
  answer: string;
}

interface AppState {
  apiKey: string;
  setApiKey: (key: string) => void;

  question: string;
  setQuestion: (q: string) => void;
  
  selectedSpread: SpreadType;
  setSelectedSpread: (s: SpreadType) => void;
  
  drawnCards: DrawnCard[];
  setDrawnCards: (cards: DrawnCard[]) => void;
  
  currentReading: string | null;
  setCurrentReading: (reading: string | null) => void;

  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  loadHistoryItem: (item: HistoryItem) => void;

  visitCount: number;
  incrementVisitCount: () => void;
  hasSeenPromo: boolean;
  markPromoSeen: () => void;

  reset: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),

      question: '',
      setQuestion: (q) => set({ question: q }),
      
      selectedSpread: 'single',
      setSelectedSpread: (s) => set({ selectedSpread: s }),
      
      drawnCards: [],
      setDrawnCards: (cards) => set({ drawnCards: cards }),

      currentReading: null,
      setCurrentReading: (reading) => set({ currentReading: reading }),

      history: [],
      addToHistory: (item) => set((state) => ({ history: [item, ...state.history] })),
      clearHistory: () => set({ history: [] }),
      loadHistoryItem: (item) => set({
        question: item.question,
        selectedSpread: item.spread,
        drawnCards: item.cards,
        currentReading: item.answer
      }),

      visitCount: 0,
      incrementVisitCount: () => set((state) => ({ visitCount: state.visitCount + 1 })),
      hasSeenPromo: false,
      markPromoSeen: () => set({ hasSeenPromo: true }),
      
      reset: () => set({ question: '', selectedSpread: 'single', drawnCards: [], currentReading: null }),
    }),
    {
      name: 'tarot-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        apiKey: state.apiKey, 
        history: state.history,
        visitCount: state.visitCount,
        hasSeenPromo: state.hasSeenPromo
      }),
    }
  )
);
