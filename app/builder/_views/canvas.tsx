"use client";

import { ReactFlow, useNodesState, useEdgesState, Edge, Background, BackgroundVariant, SelectionMode } from "@xyflow/react";
import StackNode from "../_components/group";
import { Group } from "@/types/common";
import useInitCanvas from "@/hooks/use-init-canvas";
import useLoadDemo from "@/hooks/use-load-demo";

const nodeTypes = {
  GROUP: StackNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Group>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { onDrop, onDragOver } = useInitCanvas();
  useLoadDemo({ isCanvasInitialized: true });

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
      // panOnScrollMode="vertical"
    >
      <Background variant={BackgroundVariant.Lines} />
    </ReactFlow>
  );
};

export default Canvas;
