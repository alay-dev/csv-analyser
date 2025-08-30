import { devtools } from "zustand/middleware";
import { create } from "zustand";
import { Chart, EntityType, NodeAttribute } from "@/types/common";

export type CSVRow = Record<string, string>;

export type Tag = {
  name: string;
  id: string;
  sessionID: string;
  prompt: string;
};

type NodeData = {
  id: string;
  tag: Tag;
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
  tags: Tag[];
  currentTag?: Tag;
  setFileName: (data?: string) => void;
  setFileData: (data: FileData) => void;
  getNodeData: (id: string) => NodeData;
  addNodeData: (node: NodeData) => void;
  updateNodeData: (id: string, updates: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  addTags: (tags: Tag[]) => void;
  deleteTag: (tagId: string) => void;
  setCurrentTag: (tag: Tag) => void;
}

export const useDataStore = create<DataState>()(
  devtools((set, get) => ({
    fileName: undefined,
    fileData: undefined,
    nodeData: [],
    tags: [],
    currentTag: undefined,
    setFileName: (val) => set({ fileName: val }),
    setFileData: (data) => set({ fileData: data, fileName: data.fileName }),
    getNodeData: (id) => get().nodeData.find((item) => item.id === id),
    addNodeData: (node) => set((state) => ({ nodeData: [...state.nodeData, node] })),
    updateNodeData: (id, updates) => set((state) => ({ nodeData: state.nodeData.map((item) => (item.id === id ? { ...item, ...updates } : item)) })),
    deleteNode: (id) => set((state) => ({ nodeData: state.nodeData.filter((item) => item.id !== id) })),
    addTags: (tags) => set((state) => ({ tags: [...state.tags, ...tags], currentTag: tags[0] })),
    deleteTag: (tagId) => set((state) => ({ tags: state.tags.filter((tag) => tag.id !== tagId) })),
    setCurrentTag: (tag) => set(() => ({ currentTag: tag })),
  }))
);
