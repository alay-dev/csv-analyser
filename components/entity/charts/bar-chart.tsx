"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart as Chart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { chartConfig, ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useDataStore } from "@/store/data";
import { useMemo } from "react";

const BarChart = () => {
  const { data } = useDataStore();

  const chartData = useMemo(() => {
    console.log(data);
    return data.map((item) => ({
      date: item.Date,
      value: +item.Clicks,
    }));
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[10rem] m-0">
      <Chart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" fill="var(--color-desktop)" radius={8} />
      </Chart>
    </ChartContainer>
  );
};

export default BarChart;
