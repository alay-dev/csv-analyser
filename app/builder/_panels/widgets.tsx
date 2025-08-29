import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useGroupStore } from "@/store/group";
import { useAppStore } from "@/store/main";
import { Element } from "@/types/common";
import { nanoid } from "nanoid";
import { DragEvent } from "react";
import { CloseCircle } from "solar-icon-set";
import { WIDGETS } from "@/constants/charts";

export const WidgetPanel = () => {
  const setPanel = useAppStore((state) => state.setPanel);
  const { setDragGroupElement, dragGroupElement } = useGroupStore((state) => state);

  const onDragStart = (event: DragEvent<HTMLElement>, subType: string) => {
    const groupElement: Element = {
      id: nanoid(),
      isInitialized: false,
      type: "WIDGET",
      subType,
      text: subType === "text" ? "Some text" : undefined,
    };
    setDragGroupElement(groupElement);
    event.dataTransfer.effectAllowed = "move";
    const dragImage = event.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.position = "absolute";
    dragImage.style.width = "10rem";
    dragImage.style.border = `1px solid #006553`;
    dragImage.style.backgroundColor = "#006553";
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
    <div className="bg-background h-full shadow-xl p-5 relative border-r">
      <div onClick={() => setPanel(null)} className="absolute top-2 right-2 z-10 hover:bg-gray-100 transition duration-200 w-8 h-8 flex items-center justify-center rounded-md text-gray-500 cursor-pointer">
        <CloseCircle size={20} className="m-0 p-0 flex" />
      </div>

      <div className="w-full relative">
        <h4 className="text-lg font-semibold text-black">Widget</h4>
      </div>
      <Separator className="my-2 " />
      <div className="mt-5 grid grid-cols-2 gap-3">
        {WIDGETS.map((item) => {
          return (
            <div
              draggable
              onDragEnd={onDragEnd}
              onDragStart={(e) => onDragStart(e, item.subType)}
              key={item.label}
              className={cn("flex items-center gap-2 rounded-lg bg-gray-50 border p-2 px-4 cursor-pointer", dragGroupElement?.type === item.type && "opacity-30")}
            >
              <item.icon size={15} />
              <p className="font-medium text-sm">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
