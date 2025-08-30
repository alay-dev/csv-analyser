import { pGenericGenerateDashboard } from "@/constants/prompts";
import { createChartNode, createTextNode } from "@/lib/group";
import { Tag, useDataStore } from "@/store/data";
import { useAppStore } from "@/store/main";
import { Entity, SummaryMetric } from "@/types/common";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useCallAgent from "./use-call-agent";
import { nanoid } from "nanoid";

const useInitReport = () => {
  const { addNodeData, currentTag } = useDataStore();
  const { setInitialized, isInitialized } = useAppStore();
  const { callAiAgent } = useCallAgent();

  const initReport = useCallback(
    async (tag: Tag, sessionID: string) => {
      setInitialized(false);
      const res = await callAiAgent(pGenericGenerateDashboard, sessionID);
      const parsedData = JSON.parse(res.response) as SummaryMetric;
      for (const item of parsedData.items) {
        const id = nanoid();

        const position = { x: item.x, y: item.y };

        switch (item.entity_type) {
          case "TEXT":
            const textElement: Entity = { id, position, type: "GROUP", data: { element: createTextNode(id, item.text), name: `Group` } };
            addNodeData({ id, tag, data: { type: "WIDGET", text: item.text, attributes: { ...position, width: item.width + 40, height: item.height } } });
            // addNodes([textElement]);
            break;
          case "CHART":
            if (!item.chart.data.length) continue;
            const element: Entity = { id, position, type: "GROUP", data: { element: createChartNode(item.chart.chart_type, id), name: `Group` } };
            addNodeData({ id, tag, data: { type: "CHART", chart: item.chart, attributes: { ...position, width: item.width, height: item.height } } });
            // addNodes([element]);

            break;
        }

        // nodes.push({ ...position, height: 250, width: 400 });
      }
    },
    [addNodeData, callAiAgent, setInitialized]
  );
  return [initReport];
};

export default useInitReport;
