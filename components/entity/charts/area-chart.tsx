"use client";

import { Area, AreaChart as Chart, CartesianGrid, XAxis } from "recharts";
import { chartConfig, ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useDataStore } from "@/store/data";
import { useMemo } from "react";
import { format } from "date-fns";
import { useNodeId } from "@xyflow/react";

const AreaChart = () => {
  const id = useNodeId()!;
  const { getNodeData } = useDataStore();

  const chartData = useMemo(() => {
    return getNodeData(id)?.data.chart?.data!;
  }, []);

  return (
    <ChartContainer config={chartConfig} className=" m-0 borders">
      <Chart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Area dataKey="value" type="natural" fill="var(--color-mobile)" fillOpacity={0.4} stroke="var(--color-mobile)" stackId="a" />
        {/* <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" /> */}
      </Chart>
    </ChartContainer>
  );
};

export default AreaChart;
