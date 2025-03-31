import { GroupElement } from "@/types/common";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface GroupState {
  draggedOverGroup?: string;
  dragGroupElement?: GroupElement;
  totalGroup: number;
  setDraggedOverGroup: (val?: string) => void;
  setDragGroupElement: (val?: GroupElement) => void;
  increaseGroupCount: () => void;
  dereaseGroupCount: () => void;
}

export const useGroupStore = create<GroupState>()(
  devtools((set) => ({
    draggedOverGroup: undefined,
    dragGroupElement: undefined,
    totalGroup: 0,
    setDraggedOverGroup: (val) => set({ draggedOverGroup: val }),
    setDragGroupElement: (val) => set({ dragGroupElement: val }),
    increaseGroupCount: () => set((state) => ({ totalGroup: state.totalGroup + 1 })),
    dereaseGroupCount: () => set((state) => ({ totalGroup: state.totalGroup - 1 })),
  }))
);
