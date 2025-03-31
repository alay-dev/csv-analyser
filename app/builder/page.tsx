"use client";

import Main from "@/app/_layout/main";
import { ChartPanel } from "@/app/builder/_panels/charts";
import { useAppStore } from "@/store/main";
import { ReactFlowProvider } from "@xyflow/react";
import Canvas from "./_views/canvas";
import { MetricPanel } from "./_panels/metric";
import { WidgetPanel } from "./_panels/widgets";

const Builder = () => {
  const panel = useAppStore((state) => state.panel);

  return (
    <Main>
      <ReactFlowProvider>
        <div className="bg-gray-50 w-full h-full rounded-tl-xl overflow-hidden relative">
          <Canvas />
          {panel ? (
            <div className="absolute top-0 left-0 h-full w-[20rem] z-20">
              {(() => {
                switch (panel) {
                  case "chart":
                    return <ChartPanel />;
                  case "metric":
                    return <MetricPanel />;
                  case "widget":
                    return <WidgetPanel />;
                  default:
                    return null;
                }
              })()}
            </div>
          ) : null}
        </div>
      </ReactFlowProvider>
    </Main>
  );
};

export default Builder;
