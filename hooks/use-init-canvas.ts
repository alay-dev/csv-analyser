"use client";

import { useGroupStore } from "@/store/group";
import { GroupElement } from "@/types/common";
import { useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { DragEvent, useCallback } from "react";
import "@xyflow/react/dist/style.css";

const useInitCanvas = () => {
  const { screenToFlowPosition, addNodes } = useReactFlow();
  const { dragGroupElement, increaseGroupCount, totalGroup } = useGroupStore((state) => state);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!dragGroupElement) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const element: GroupElement = Object.assign(dragGroupElement, { isInitialized: true });
      const group = { id: nanoid(), type: "GROUP", position, data: { group: [element], name: `Group ${totalGroup + 1}` } };

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
