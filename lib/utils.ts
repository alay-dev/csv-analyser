import { NodeAttribute } from "@/types/common";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type LayoutOptions = {
  canvasWidth: number;
  boxWidth: number;
  boxHeight: number;
  margin?: number;
};

export function getNextPosition(existing: NodeAttribute[], options: LayoutOptions): { x: number; y: number } {
  const { canvasWidth, boxWidth, boxHeight, margin = 40 } = options;

  const cols = Math.floor(canvasWidth / (boxWidth + margin));

  // If no existing boxes, place at (0, 0)
  if (existing.length === 0) {
    return { x: 0, y: 0 };
  }

  // Try every row/col slot sequentially
  let row = 0;
  while (true) {
    for (let col = 0; col < cols; col++) {
      const x = col * (boxWidth + margin);
      const y = row * (boxHeight + margin);

      const overlaps = existing.some((el) => {
        return !(x + boxWidth <= el.x || x >= el.x + el.width || y + boxHeight <= el.y || y >= el.y + el.height);
      });

      if (!overlaps) {
        return { x, y };
      }
    }
    row++;
  }
}
