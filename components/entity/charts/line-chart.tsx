"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart as Chart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useNodeId } from "@xyflow/react";
import { useDataStore } from "@/store/data";
import { useMemo } from "react";

export const description = "A line chart";

const defaultChartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  1: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  2: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  3: {
    label: "Tablet",
    color: "var(--chart-3)",
  },
  4: {
    label: "Other",
    color: "var(--chart-4)",
  },
  5: {
    label: "Extra",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

// Define colors for different lines
const lineColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"];

export function LineChart() {
  const id = useNodeId()!;
  const { getNodeData } = useDataStore();

  const chartData = useMemo(() => {
    return getNodeData(id)?.data.chart?.data || [];
  }, []);

  const xAxis = getNodeData(id)?.data.chart?.x_axis[0]!;
  const yAxis = getNodeData(id)?.data.chart?.y_axis!;
  const title = getNodeData(id)?.data?.chart?.chart_name!;

  return (
    <div>
      <p>{title}</p>
      <ChartContainer config={chartConfig} className="m-0 h-full">
        <Chart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={xAxis} tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          {yAxis.map((axis, i) => (
            <Line key={axis} dataKey={axis} type="monotone" stroke={lineColors[i % lineColors.length]} strokeWidth={2} dot={{ fill: lineColors[i % lineColors.length], r: 3 }} />
          ))}
        </Chart>
      </ChartContainer>
    </div>
  );
}
