import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { useDataStore } from "@/store/data";
import { Entity } from "@/types/common";
import { Edge, NodeToolbar, Position, useNodeId, useNodesData, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { TextBold, TextItalic, TextUnderline } from "solar-icon-set";

const Text = ({ selected }: { selected: boolean }) => {
  const id = useNodeId()!;
  const { updateNodeData, getNodeData } = useDataStore();
  const nodeID = useNodeId()!;
  const element = getNodeData(nodeID)!;

  if (!element) throw new Error("Element  not found");

  const [text, setText] = useState(element?.data?.text || "");

  const onUpdateText = () => {
    updateNodeData(nodeID, { data: { ...element.data, text } });
  };

  const onToggleUnderline = () => {
    // let updatedGroup = nodeData.group;
    // updatedGroup = updatedGroup.map((item) => {
    //   if (item.id !== elementID) return item;
    //   item.text = { ...element, underline: !element?.underline };
    //   return item;
    // });
    // updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };

  const onToggleItalic = () => {
    // let updatedGroup = nodeData.group;
    // updatedGroup = updatedGroup.map((item) => {
    //   if (item.id !== elementID) return item;
    //   item.text = { ...element, italic: !element?.italic };
    //   return item;
    // });
    // updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };

  const onToggleBold = () => {
    // let updatedGroup = nodeData.group;
    // updatedGroup = updatedGroup.map((item) => {
    //   if (item.id !== elementID) return item;
    //   item.text = { ...element, bold: !element?.bold };
    //   return item;
    // });
    // updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };

  return (
    <div className="">
      <input value={text} onChange={(e) => setText(e.target.value)} onBlur={onUpdateText} className={cn("focus:outline-double outline-gray-300 rounded-sm w-full font-semibold text-xl")} />

      {/* <NodeToolbar position={Position.Bottom} className="">
        <div className="bg-card border p-3 rounded-md flex  gap-2 items-center">
          <p className="text-sm text-gray-700">Style : </p>
          <div className="rounded-md border flex overflow-hidden w-max">
            <Button onClick={onToggleBold} className={cn("rounded-none border-r hover:text-secondary", element?.bold ? "" : "bg-transparent text-primary")}>
              <TextBold />
            </Button>
            <Button onClick={onToggleItalic} className={cn("rounded-none border-r hover:text-secondary", element?.italic ? "" : "bg-transparent text-primary")}>
              <TextItalic />
            </Button>
            <Button onClick={onToggleUnderline} className={cn("rounded-none hover:text-secondary", element?.underline ? "" : "bg-transparent text-primary")}>
              <TextUnderline />
            </Button>
          </div>
        </div>
      </NodeToolbar> */}
    </div>
  );
};

export default Text;
