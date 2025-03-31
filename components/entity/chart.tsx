"use client";

import AreaChart from "./charts/area-chart";
import BarChart from "./charts/bar-chart";
import PieChart from "./charts/pie-chart";

const Chart = ({ type }: { type: string }) => {
  switch (type) {
    case "AREA":
      return <AreaChart />;
    case "BAR":
      return <BarChart />;
    case "PIE":
      return <PieChart />;
  }
};

export default Chart;
