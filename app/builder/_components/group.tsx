import Chart from "@/components/entity/chart";
import Widget from "@/components/entity/charts/widget";
import Metric from "@/components/entity/metric";
import { Button } from "@/components/ui/button";
import { campaignMetricsTitleMap } from "@/constants/charts";
import { cn } from "@/lib/utils";
import { useGroupStore } from "@/store/group";
import { Group } from "@/types/common";
import { Edge, NodeProps, NodeResizer, NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { memo, useCallback } from "react";
import { Copy, TrashBin2 } from "solar-icon-set";

const StackNode = memo(({ data, selected, ...props }: NodeProps<Group>) => {
  const { deleteElements } = useReactFlow<Group, Edge>();
  const { dereaseGroupCount } = useGroupStore((state) => state);
  const stack = data.group;

  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id: props.id }] });
    dereaseGroupCount();
  }, [deleteElements, dereaseGroupCount, props.id]);

  return (
    <div id={props.id} className={cn("bg-white rounded-lg border border-blue-100 transition duration-300  overflow-hidden", selected && "border border-blue-700")}>
      <NodeResizer minWidth={100} minHeight={30} lineClassName="opacity-0 " handleClassName="opacity-0" />
      <NodeToolbar position={Position.Top}>
        <div className="flex items-center border border-blue-300 rounded-lg bg-white overflow-hidden ">
          <Button variant={"ghost"} size={"icon"} className="border-r border-r-blue-300 rounded-none px-5">
            <Copy />
          </Button>
          <Button onClick={onDelete} variant={"ghost"} size={"icon"} className="rounded-none px-5">
            <TrashBin2 />
          </Button>
        </div>
      </NodeToolbar>

      <div className="p-5">
        {stack.map((item) => {
          switch (item.type) {
            case "CHART":
              return <Chart key={item.id} type={item.subType} />;
            case "METRIC":
              return <Metric key={item.id} label={item.subType} selected={selected} />;
            case "WIDGET":
              return <Widget key={item.id} type={item.subType} id={item.id} selected={selected} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
});

export default StackNode;

StackNode.displayName = "StackNode";
