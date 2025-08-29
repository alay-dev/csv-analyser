"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Loader2 } from "lucide-react";

interface InitDashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeable?: boolean;
}

export const InitDashboardModal = ({ open, onOpenChange, closeable }: InitDashboardModalProps) => {
  return (
    <Dialog open={open} onOpenChange={closeable ? onOpenChange : () => {}}>
      <DialogContent className="max-w-md border-0 shadow-none bg-card">
        <DialogHeader className="opacity-0">
          <DialogTitle>Intialize Dashboard</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg p-8">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary/60" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-lg">Generating Report...</p>
              <p className="text-sm text-gray-600">AI is analyzing your data and creating insights</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
