"use client";

import { ReactFlow, useNodesState, useEdgesState, Edge, Background, BackgroundVariant, SelectionMode, PanOnScrollMode, useReactFlow } from "@xyflow/react";
import StackNode from "../_components/group";
import { Entity, SummaryMetric } from "@/types/common";
import useInitCanvas from "@/hooks/use-init-canvas";
import { useDataStore } from "@/store/data";
import useLoadDemo from "@/hooks/use-load-demo";
import { useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { createChartNode, createTextNode } from "@/lib/group";
import { useAppStore } from "@/store/main";
import { InitDashboardModal } from "../_modal/init-dashboard";

const nodeTypes = {
  GROUP: StackNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Entity>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { onDrop, onDragOver } = useInitCanvas();
  const { setFileName, addNodeData, nodeData, sessionId } = useDataStore();
  const { setInitialized, isInitialized } = useAppStore();
  const { addNodes } = useReactFlow();

  const sessionID = useDataStore((state) => state.sessionId);
  const { callAiAgent } = useLoadDemo();

  const init = useCallback(async () => {
    setInitialized(false);
    const res = await callAiAgent("Generate a overview or a dashboard for the data in the form of charts in a dashboard format");
    const parsedData = JSON.parse(res.response) as SummaryMetric;
    const nodes = [];
    for (const item of parsedData.items) {
      const id = nanoid();

      const position = { x: item.x, y: item.y };

      switch (item.entity_type) {
        case "TEXT":
          const textElement: Entity = { id, position, type: "GROUP", data: { element: createTextNode(id, item.text), name: `Group` } };
          addNodeData({ id, data: { type: "WIDGET", text: item.text, attributes: { ...position, width: item.width + 40, height: item.height } } });
          addNodes([textElement]);
          break;
        case "CHART":
          const element: Entity = { id, position, type: "GROUP", data: { element: createChartNode(item.chart.chart_type, id), name: `Group` } };
          addNodeData({ id, data: { type: "CHART", chart: item.chart, attributes: { ...position, width: item.width, height: item.height } } });
          addNodes([element]);

          break;
      }

      nodes.push({ ...position, height: 250, width: 400 });
    }
    setInitialized(true);
  }, [addNodeData, addNodes, callAiAgent, setInitialized]);

  useEffect(() => {
    if (!sessionID) {
      return;
    }

    init();
  }, [callAiAgent, init, sessionID]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      defaultViewport={defaultViewport}
      // panOnDrag={false}
      fitView
      onDrop={onDrop}
      onDragOver={onDragOver}
      snapGrid={[10, 10]}
      snapToGrid
      panOnScroll
      selectionOnDrag
      panOnDrag={[1, 2]}
      selectionMode={SelectionMode.Full}
      minZoom={0.4}
      maxZoom={3}
    >
      <Background variant={BackgroundVariant.Lines} />
    </ReactFlow>
  );
};

export default Canvas;
