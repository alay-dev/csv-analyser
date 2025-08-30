"use client";

import { Bar, BarChart as Chart, CartesianGrid, XAxis } from "recharts";
import { chartConfig, ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useDataStore } from "@/store/data";
import { useMemo } from "react";
import { useNodeId } from "@xyflow/react";

const BarChart = () => {
  const id = useNodeId()!;
  const { getNodeData, nodeData } = useDataStore();
  console.log(nodeData, id, "NODE DATA");

  const node = getNodeData(id)?.data;

  const chartData = useMemo(() => {
    return node?.chart?.data || [];
  }, [node?.chart?.data]);

  console.log(chartData, "CHART DATA");

  const xAxis = node?.chart?.x_axis[0] || "sample X axis";
  const yAxis = node?.chart?.y_axis[0] || "sample Y axis";
  const title = node?.chart?.chart_name || "Sample Chart Name";

  return (
    <div>
      <p>{title}</p>
      <ChartContainer config={chartConfig} className="m-0 h-full">
        <Chart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={xAxis} tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey={yAxis} fill="var(--color-desktop)" radius={8} />
        </Chart>
      </ChartContainer>
    </div>
  );
};

export default BarChart;
