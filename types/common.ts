import { Node } from "@xyflow/react";

export type GroupElement = {
  id: string;
  type: Entity;
  text?: {
    value: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  isInitialized: boolean;
  variable?: string;
  subType: string;
  metric?: {
    value: string;
    label: string;
  };
};

export type Group = Node<{ group: GroupElement[]; name: string }>;
export type Chart = "LINE" | "AREA" | "BAR" | "PIE";
export type Entity = "CHART" | "METRIC" | "WIDGET";
