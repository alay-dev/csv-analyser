import { Entity, Element } from "@/types/common";
import { nanoid } from "nanoid";

export const createChartNode = (type: string, id: string) => {
  const chart: Element = { id, isInitialized: true, type: "CHART", subType: type };
  return chart;
};

export const createTextNode = (id: string, content: string) => {
  const text: Element = { id, isInitialized: true, type: "WIDGET", subType: "TEXT", text: content };
  return text;
};
