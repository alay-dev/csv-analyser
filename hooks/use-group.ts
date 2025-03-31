import { Edge, useNodesData, useReactFlow } from "@xyflow/react";
import { Group } from "types/common";

// type Props = {
//   nodeID: string;
// };

const useGroup = (nodeID: string) => {
  const { deleteElements, getNode } = useReactFlow<Group, Edge>();
  const group = useNodesData<Group>([nodeID])[0].data.group;

  const adjustPrevStack = (nodeID: string, elementID: string) => {
    const node = getNode(nodeID);
    if (node?.data.group.length === 1) deleteElements({ nodes: [node] });
  };

  const isCurrentStackElement = (ID: string) => {
    const index = group.findIndex((item) => item.id === ID);
    if (index === -1) return false;
    return true;
  };

  const determineClosestPlaceholder = (dropY: number) => {
    let closest: { id: string; val: number; delta: "after" | "before" } = { id: "", val: Infinity, delta: "before" };

    for (const item of group) {
      const before = document.getElementById(item.id + "before")?.getBoundingClientRect();
      const after = document.getElementById(item.id + "after")?.getBoundingClientRect();

      const beforeDelta = before ? Math.abs(before.y - dropY) : Infinity;
      const afterDelta = after ? Math.abs(after.y - dropY) : Infinity;

      if (beforeDelta < closest.val || afterDelta < closest.val) {
        if (beforeDelta < afterDelta) {
          closest = { id: item.id, val: beforeDelta, delta: "before" };
        } else {
          closest = { id: item.id, val: afterDelta, delta: "after" };
        }
      }
    }

    return closest;
  };

  return { adjustPrevStack, isCurrentStackElement, determineClosestPlaceholder };
};

export default useGroup;
