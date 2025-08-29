"use client";

import AreaChart from "./charts/area-chart";
import BarChart from "./charts/bar-chart";
import { LineChart } from "./charts/line-chart";
import PieChart from "./charts/pie-chart";

const Chart = ({ type }: { type: string }) => {
  switch (type) {
    case "AREA":
      return <AreaChart />;
    case "BAR":
      return <BarChart />;
    case "LINE":
      return <LineChart />;
    case "PIE":
      return <PieChart />;
  }
};

export default Chart;
