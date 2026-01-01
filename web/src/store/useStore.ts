import { create } from 'zustand';
import { HourCard } from '@/data/hours';

export type SpreadType = 'single' | 'three' | 'five';

export interface DrawnCard extends HourCard {
  isReversed: boolean;
  positionName: string;
  positionDescription: string;
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
  
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  apiKey: '',
  setApiKey: (key) => set({ apiKey: key }),

  question: '',
  setQuestion: (q) => set({ question: q }),
  
  selectedSpread: 'single',
  setSelectedSpread: (s) => set({ selectedSpread: s }),
  
  drawnCards: [],
  setDrawnCards: (cards) => set({ drawnCards: cards }),
  
  reset: () => set({ question: '', selectedSpread: 'single', drawnCards: [] }),
}));
