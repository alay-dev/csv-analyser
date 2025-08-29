"use client";

import { useGroupStore } from "@/store/group";
import { Element, Entity } from "@/types/common";
import { useReactFlow } from "@xyflow/react";
import { DragEvent, useCallback } from "react";
import "@xyflow/react/dist/style.css";
import { useDataStore } from "@/store/data";

const useInitCanvas = () => {
  const { screenToFlowPosition, addNodes } = useReactFlow();
  const { addNodeData } = useDataStore();
  const { dragGroupElement, increaseGroupCount, totalGroup } = useGroupStore((state) => state);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!dragGroupElement) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const element: Element = Object.assign(dragGroupElement, { isInitialized: true });
      const group: Entity = { id: dragGroupElement.id, type: "GROUP", position, data: { element, name: `Group ${totalGroup + 1}` } };

      if (element.type === "WIDGET") {
        addNodeData({ id: dragGroupElement.id, data: { type: "WIDGET", text: dragGroupElement.text, attributes: { ...position, width: 200, height: 50 } } });
      }

      addNodes([group]);
      increaseGroupCount();
    },
    [dragGroupElement, increaseGroupCount, screenToFlowPosition, addNodes, totalGroup]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return { onDrop, onDragOver };
};

export default useInitCanvas;
