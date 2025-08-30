"use client";

import { ReactFlow, useNodesState, useEdgesState, Edge, Background, BackgroundVariant, SelectionMode, PanOnScrollMode, useReactFlow } from "@xyflow/react";
import StackNode from "../_components/group";
import { Entity } from "@/types/common";
import useInitCanvas from "@/hooks/use-init-canvas";
import { Tag, useDataStore } from "@/store/data";
import useCallAgent from "@/hooks/use-call-agent";
import { useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { pGenericGenerateDashboard } from "@/constants/prompts";
import useInitReport from "@/hooks/use-init-report";
import { createChartNode, createTextNode } from "@/lib/group";
import { useAppStore } from "@/store/main";

const nodeTypes = {
  GROUP: StackNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Entity>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { addNodes } = useReactFlow();
  const { onDrop, onDragOver } = useInitCanvas();
  const { tags, addTags, setCurrentTag, currentTag, nodeData } = useDataStore();
  const { setInitialized, isInitialized } = useAppStore();

  useEffect(() => {
    console.log("USE EFFECT CALLED");
    if (!currentTag?.sessionID) return;
    if (!nodeData.length) return;
    if (isInitialized) return;

    for (const node of nodeData) {
      const element: Entity[] = [];
      const id = node.id;
      const position = { x: node.data.attributes.x, y: node.data.attributes.y };
      switch (node.data.type) {
        case "CHART":
          element.push({ id, position, type: "GROUP", data: { element: createChartNode(node.data.chart?.chart_type || "BAR", id), name: `Group` } });
          break;
        case "WIDGET":
          element.push({ id, position, type: "GROUP", data: { element: createTextNode(id, node.data.text || "Sample Heading"), name: `Group` } });
          break;
        default:
          continue;
      }

      addNodes(element);
      setInitialized(true);
    }
  }, [addNodes, currentTag?.sessionID, isInitialized, nodeData, setInitialized]);

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
