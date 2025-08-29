import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: null | string;
  panel: null | string;
  isAiAgent: boolean;
  isTestPanel: boolean;
  activeElement: null | string;
  isPanDisabled: boolean;
  setInitialized: (value: boolean) => void;
  setAuthenticated: (value: boolean) => void;
  setUser: (value: string | null) => void;
  setPanel: (value: string | null) => void;
  setActiveElement: (val: null | string) => void;
  setDisablePan: (val: boolean) => void;
  setTestPanel: (val: boolean) => void;
  setAiAgent: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    isInitialized: false,
    isAuthenticated: false,
    user: null,
    panel: null,
    activeElement: null,
    isPanDisabled: false,
    isTestPanel: false,
    isAiAgent: true,
    setAiAgent: (val) => set({ isAiAgent: val }),
    setInitialized: (val) => set({ isInitialized: val }),
    setAuthenticated: (val) => set({ isAuthenticated: val }),
    setUser: (val) => set({ user: val }),
    setPanel: (val) => set({ panel: val }),
    setActiveElement: (val) => set({ activeElement: val }),
    setDisablePan: (val) => set({ isPanDisabled: val }),
    setTestPanel: (val) => set({ isTestPanel: val }),
  }))
);
