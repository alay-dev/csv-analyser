"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface InitDashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeable?: boolean;
}

export const InitDashboardModal = ({ open, onOpenChange, closeable }: InitDashboardModalProps) => {
  // Determine visibility: Dialog uses inverted open prop
  const isVisible = !open;

  // Rotating AI status messages
  const messages = useMemo(
    () => ["AI is analyzing your data and creating insights", "Detecting data types and structures", "Finding correlations and trends", "Identifying outliers and anomalies", "Summarizing key metrics", "Building visualizations"],
    []
  );
  const [msgIndex, setMsgIndex] = useState(0);

  // Cycle messages while modal is visible
  useEffect(() => {
    if (!isVisible) {
      setMsgIndex(0);
      return;
    }
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [isVisible, messages.length]);

  const currentMessage = messages[msgIndex];

  return (
    <Dialog open={open} onOpenChange={closeable ? onOpenChange : () => {}}>
      <DialogContent className="max-w-md border-0 shadow-none bg-transparent p-0">
        {/* Hidden header to keep dialog structure */}
        <DialogHeader className="opacity-0">
          <DialogTitle>Intialize Dashboard</DialogTitle>
        </DialogHeader>

        {/* Animated gradient container */}
        <div className="relative overflow-hidden rounded-2xl p-8 animated-gradient">
          {/* Soft glow accents */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-yellow-400/30 blur-3xl" />

          <div className="relative z-10 text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-white drop-shadow-[0_0_20px_rgba(192,132,252,0.8)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white/70" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-lg bg-gradient-to-r from-purple-200 via-fuchsia-200 to-yellow-100 bg-clip-text text-transparent">Generating Report...</p>
              <p className="text-sm text-white/80">{currentMessage}</p>
              {/* <div className="flex items-center justify-center gap-1 mt-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-300 to-yellow-300 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-300 to-yellow-300 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-300 to-yellow-300 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Local styles for animated gradient */}
        <style jsx>{`
          @keyframes gradientShift {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animated-gradient {
            /* Purple -> Fuchsia -> Yellow */
            background: linear-gradient(135deg, #7c3aed, #a21caf, #f59e0b);
            background-size: 300% 300%;
            animation: gradientShift 8s ease infinite;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};
