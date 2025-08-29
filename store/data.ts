import { devtools } from "zustand/middleware";
import { create } from "zustand";
import { Chart, EntityType, NodeAttribute } from "@/types/common";

export type CSVRow = Record<string, string>;

type NodeData = {
  id: string;
  data: {
    type: EntityType;
    chart?: Chart;
    text?: string;
    attributes: NodeAttribute;
  };
};

interface FileData {
  fileName: string;
  fileUrl: string;
}

interface DataState {
  fileName?: string;
  fileData?: FileData;
  nodeData: NodeData[];
  setFileName: (data?: string) => void;
  setFileData: (data: FileData) => void;
  getNodeData: (id: string) => NodeData;
  addNodeData: (node: NodeData) => void;
  updateNodeData: (id: string, updates: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  setSessionId: (id: string) => void;
  sessionId?: string;
}

export const useDataStore = create<DataState>()(
  devtools((set, get) => ({
    fileName: undefined,
    fileData: undefined,
    nodeData: [],
    sessionId: undefined,
    setFileName: (val) => set({ fileName: val }),
    setFileData: (data) => set({ fileData: data, fileName: data.fileName }),
    getNodeData: (id) => get().nodeData.find((item) => item.id === id),
    addNodeData: (node) => set((state) => ({ nodeData: [...state.nodeData, node] })),
    updateNodeData: (id, updates) => set((state) => ({ nodeData: state.nodeData.map((item) => (item.id === id ? { ...item, ...updates } : item)) })),
    deleteNode: (id) => set((state) => ({ nodeData: state.nodeData.filter((item) => item.id !== id) })),
    setSessionId: (val) => set({ sessionId: val }),
  }))
);
