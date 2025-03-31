"use client";

import { Area, AreaChart as Chart, CartesianGrid, XAxis } from "recharts";
import { chartConfig, ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useDataStore } from "@/store/data";
import { useMemo } from "react";
import { format } from "date-fns";

const AreaChart = () => {
  const { data } = useDataStore();

  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: format(new Date(item.Date), "dd"),
      value: +item.Spend,
    }));
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[10rem] m-0 borders">
      <Chart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Area dataKey="value" type="natural" fill="var(--color-mobile)" fillOpacity={0.4} stroke="var(--color-mobile)" stackId="a" />
        {/* <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" /> */}
      </Chart>
    </ChartContainer>
  );
};

export default AreaChart;
