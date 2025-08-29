import { demoData, demoFileName, demoNodes } from "@/constants/demo";
import { createChartNode, createTextNode } from "@/lib/group";
import { useDataStore } from "@/store/data";
import { AiAgentRes, Entity, SummaryMetric } from "@/types/common";
import { useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback, useEffect } from "react";

const useLoadDemo = () => {
  const { setFileName, addNodeData, nodeData, sessionId } = useDataStore();

  const callAiAgent = useCallback(
    async (query: string) => {
      return fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, session_id: sessionId }),
      }).then(async (res) => {
        return (await res.json()) as AiAgentRes;
      });
    },
    [sessionId]
  );

  // useEffect(() => {
  //   if (!isCanvasInitialized) return;
  //   setFileName(demoFileName);
  //   setNodes(demoNodes);
  // }, [isCanvasInitialized, setFileName, setNodes]);

  // useEffect(() => {
  //   (async () => {
  //     const { response, type } = await callAiAgent("Generate a overview or a dashboard for the data in the form of charts in a dashboard format");
  //     const parsedData = JSON.parse(response) as SummaryMetric;

  //     const nodes = [];
  //     for (const item of parsedData.items) {
  //       const id = nanoid();

  //       const position = { x: item.x, y: item.y };

  //       switch (item.entity_type) {
  //         case "TEXT":
  //           const textElement: Entity = { id, position, type: "GROUP", data: { element: createTextNode(id, item.text), name: `Group` } };
  //           addNodeData({ id, data: { type: "WIDGET", text: item.text, attributes: { ...position, width: item.width, height: item.height } } });
  //           addNodes([textElement]);
  //           break;
  //         case "CHART":
  //           const element: Entity = { id, position, type: "GROUP", data: { element: createChartNode(item.chart.chart_type, id), name: `Group` } };
  //           addNodeData({ id, data: { type: "CHART", chart: item.chart, attributes: { ...position, width: item.width, height: item.height } } });
  //           addNodes([element]);

  //           break;
  //       }

  //       nodes.push({ ...position, height: 250, width: 400 });
  //     }
  //   })();
  // }, []);

  return { callAiAgent };
};

export default useLoadDemo;
