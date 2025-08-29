import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useGroupStore } from "@/store/group";
import { useAppStore } from "@/store/main";

import { Entity, Element, EntityType } from "@/types/common";
import { nanoid } from "nanoid";
import { DragEvent } from "react";
import { CloseCircle } from "solar-icon-set";
import { CHARTS } from "@/constants/charts";

export const ChartPanel = () => {
  const setPanel = useAppStore((state) => state.setPanel);
  const { setDragGroupElement, dragGroupElement } = useGroupStore((state) => state);

  const onDragStart = (event: DragEvent<HTMLElement>, type: EntityType, subType: string) => {
    const element: Element = { id: nanoid(), isInitialized: false, type, subType };
    setDragGroupElement(element);
    event.dataTransfer.effectAllowed = "move";
    const dragImage = event.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.position = "absolute";
    dragImage.style.color = "#fff";
    dragImage.style.top = "-9999px";
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const onDragEnd = () => {
    setDragGroupElement(undefined);
  };

  return (
    <div className="bg-background h-full shadow-xl p-5 relative border-r ">
      <div onClick={() => setPanel(null)} className="absolute z-10 top-2 right-2 hover:bg-gray-100 transition duration-200 w-8 h-8 flex items-center justify-center rounded-md text-gray-500 cursor-pointer">
        <CloseCircle size={20} className="m-0 p-0 flex" />
      </div>

      <div className="w-full relative">
        <h4 className="text-lg font-semibold text-black">Charts</h4>
      </div>
      <Separator className="my-2 " />
      <div className="mt-5 flex flex-col gap-5">
        {CHARTS.map((item) => {
          return (
            <div
              draggable
              onDragEnd={onDragEnd}
              onDragStart={(e) => onDragStart(e, item.type, item.subType)}
              key={item.label}
              className={cn("flex flex-col gap-2 rounded-lg bg-gray-50 border border-gray-200 p-2 px-4 cursor-pointer", dragGroupElement?.type === item.type && "opacity-30")}
            >
              <p className="font-medium text-sm">{item.label}</p>
              <img src={item.img} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
