import { Node } from "@xyflow/react";

export type Element = {
  id: string;
  type: EntityType;
  text?: string;
  chart?: Chart;
  isInitialized: boolean;
  variable?: string;
  subType: string;
  metric?: {
    value: string;
    label: string;
  };
};

export type Entity = Node<{ element: Element; name: string }>;
export type ChartTypes = "LINE" | "AREA" | "BAR" | "PIE";
export type EntityType = "CHART" | "METRIC" | "WIDGET";

export interface ChartDataPoint {
  [key: string]: string | number; // e.g., { "Date": "2025-02-26", "Spend": 249.82 }
}

export type Chart = {
  chart_name: string;
  chart_type: ChartTypes;
  x_axis: string[];
  y_axis: string[];
  width: number;
  height: number;
  data: ChartDataPoint[];
};

export type ChartResponse = {
  charts: Chart[];
};

export type NodeAttribute = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SummaryMetric = {
  items: {
    entity_type: "TEXT" | "CHART";
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    chart: Chart;
    table: null;
  }[];
};

export type AiAgentRes = {
  response: string;
  type: "TEXT" | "DASHBOARD" | "CHART";
  sesstion_id: string;
};
