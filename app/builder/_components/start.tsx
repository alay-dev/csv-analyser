import { cn } from "@/lib/utils";
import { Handle, Node, Position } from "@xyflow/react";
import { memo } from "react";
import { Flag } from "solar-icon-set";

const StartNode = memo(({ connectable = true }: Node) => {
  return (
    <div className={cn("bg-blue-600 rounded-xl w-max py-3 px-20 text-background")}>
      <Handle type="source" position={Position.Right} id="a" isConnectable={connectable} />
      <div className="flex gap-2 items-center">
        <Flag iconStyle="BoldDuotone" />
        <h4 className="font-semibold text-xl">Start</h4>
      </div>
    </div>
  );
});

export default StartNode;

StartNode.displayName = "StartNode";
