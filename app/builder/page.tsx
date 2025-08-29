"use client";

import Main from "@/app/_layout/main";
import { ChartPanel } from "@/app/builder/_panels/charts";
import { useAppStore } from "@/store/main";
import { useDataStore } from "@/store/data";
import { ReactFlowProvider } from "@xyflow/react";
import Canvas from "./_views/canvas";
import { MetricPanel } from "./_panels/metric";
import { WidgetPanel } from "./_panels/widgets";
import Agent from "./_panels/agent";
import { MagicStick } from "solar-icon-set";

const Builder = () => {
  const panel = useAppStore((state) => state.panel);
  const setAiAgent = useAppStore((state) => state.setAiAgent);
  const isAiAgent = useAppStore((state) => state.isAiAgent);
  const fileName = useDataStore((state) => state.fileName);
  const isInitialized = useAppStore((state) => state.isInitialized);

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
                  // case "agent":
                  //   return <Agent />;
                  default:
                    return null;
                }
              })()}
            </div>
          ) : null}
          {isAiAgent && isInitialized ? (
            <div className="absolute bottom-0 right-0 h-full w-[35rem]">
              <Agent />
            </div>
          ) : (
            <div className="absolute bottom-7 right-7">
              <div className="relative size-16">
                {/* Animated gradient ring behind the button */}
                <div className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(at_50%_50%,#8b5cf6,#f59e0b,#f97316,#8b5cf6)] animate-[spin_3s_linear_infinite]" />
                {/* Soft glow */}
                {/* <div className="pointer-events-none absolute inset-0 rounded-full blur-md opacity-50 bg-[conic-gradient(at_50%_50%,#8b5cf6,#f59e0b,#f97316,#8b5cf6)] animate-[spin_6s_linear_infinite]" /> */}
                {/* Clickable button with inner inset so the ring shows */}
                <button
                  type="button"
                  onClick={() => setAiAgent(true)}
                  aria-label="Open AI Assistant"
                  className="absolute inset-[3px] rounded-full flex items-center justify-center bg-card border shadow hover:shadow-lg transition-transform hover:scale-105"
                >
                  <MagicStick size={22} iconStyle="BoldDuotone" color="rgb(123, 31, 162)" />
                </button>
              </div>
            </div>
          )}
        </div>
      </ReactFlowProvider>
    </Main>
  );
};

export default Builder;
