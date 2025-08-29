import Chart from "@/components/entity/chart";
import Widget from "@/components/entity/charts/widget";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDataStore } from "@/store/data";
import { useGroupStore } from "@/store/group";
import { Entity } from "@/types/common";
import { Edge, NodeProps, NodeResizer, NodeToolbar, OnResize, Position, ResizeDragEvent, useNodeId, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useEffect } from "react";
import { Copy, TrashBin2 } from "solar-icon-set";

const StackNode = memo(({ data, selected, ...props }: NodeProps<Entity>) => {
  const id = useNodeId()!;
  const { deleteElements } = useReactFlow<Entity, Edge>();
  const { dereaseGroupCount } = useGroupStore((state) => state);
  const { deleteNode, getNodeData, nodeData, updateNodeData } = useDataStore();
  const node = getNodeData(id);

  useEffect(() => {
    if (!props.height || !props.width) return; // this is to prevent the error when the node is first created
    updateNodeData(id, { ...node.data, data: { ...node.data, attributes: { ...node.data.attributes, width: props.width, height: props.height } } });
    // updateNodeAttribute(stack[0].id, { width: props.width, height: props.height });
  }, [props.height, props.width]);

  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
    dereaseGroupCount();
    deleteNode(id);
  }, [deleteElements, dereaseGroupCount]);

  if (!node) return null;

  const nodeAttribute = node.data.attributes;

  return (
    <div id={props.id} className={cn("bg-white rounded-lg border border-blue-100 transition duration-300  overflow-hidden", selected && "border border-blue-700")} style={{ width: nodeAttribute.width, height: nodeAttribute.height }}>
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
        {(() => {
          switch (node.data.type) {
            case "CHART":
              return <Chart type={node.data.chart?.chart_type!} />;
            // case "METRIC":
            //   return <Metric label={node.subType} selected={selected} />;
            case "WIDGET":
              return <Widget type={"TEXT"} selected={selected} />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
});

export default StackNode;

StackNode.displayName = "StackNode";
