import { devtools } from "zustand/middleware";
import { create } from "zustand";

export type CSVRow = Record<string, string>;

interface DataState {
  fileName?: string;
  data: CSVRow[];
  setFileName: (data?: string) => void;
  setData: (data: CSVRow[]) => void;
}

export const useDataStore = create<DataState>()(
  devtools((set) => ({
    fileName: undefined,
    data: [],
    setFileName: (val) => set({ fileName: val }),
    setData: (data) => set({ data }),
  }))
);
