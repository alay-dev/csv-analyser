"use client";

import { Bar, BarChart as Chart, CartesianGrid, XAxis } from "recharts";
import { chartConfig, ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useDataStore } from "@/store/data";
import { useMemo } from "react";
import { useNodeId } from "@xyflow/react";

const BarChart = () => {
  const id = useNodeId()!;
  const { getNodeData } = useDataStore();

  const chartData = useMemo(() => {
    return getNodeData(id)?.data.chart?.data || [];
  }, []);

  const xAxis = getNodeData(id)?.data.chart?.x_axis[0]!;
  const yAxis = getNodeData(id)?.data.chart?.y_axis[0]!;
  const title = getNodeData(id)?.data?.chart?.chart_name!;

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
