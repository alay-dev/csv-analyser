import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useGroupStore } from "@/store/group";
import { useAppStore } from "@/store/main";
import { Element } from "@/types/common";
import { nanoid } from "nanoid";
import { DragEvent, useMemo } from "react";
import { CloseCircle } from "solar-icon-set";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataStore } from "@/store/data";
import { HashtagSquare } from "solar-icon-set";

export const MetricPanel = () => {
  const setPanel = useAppStore((state) => state.setPanel);
  const { setDragGroupElement, dragGroupElement } = useGroupStore((state) => state);
  // const { data } = useDataStore();

  const onDragStart = (event: DragEvent<HTMLElement>, key: string) => {
    const groupElement: Element = {
      id: nanoid(),
      isInitialized: false,
      type: "METRIC",
      subType: key,
      metric: { label: key, value: "100" },
    };
    setDragGroupElement(groupElement);
    event.dataTransfer.effectAllowed = "move";
    const dragImage = event.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.position = "absolute";
    dragImage.style.top = "-9999px";
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const onDragEnd = () => {
    setDragGroupElement(undefined);
  };

  // const metrics = useMemo(() => {
  //   if (!data?.length) return [];

  //   return Object.keys(data[0]);
  // }, [data]);

  return (
    <div className="bg-background h-full shadow-xl py-5 relative border-r">
      <div onClick={() => setPanel(null)} className="absolute top-2 right-2 z-10 hover:bg-gray-100 transition duration-200 w-8 h-8 flex items-center justify-center rounded-md text-gray-500 cursor-pointer">
        <CloseCircle size={20} className="m-0 p-0 flex" />
      </div>
      <div className="w-full relative px-5">
        <h4 className="text-lg font-semibold text-black">Metrics</h4>
      </div>
      <Separator className="my-2 " />
      <ScrollArea className="px-5 mt-5 ">
        {/* <div className="grid grid-cols-1 gap-3 max-h-[83vh] ">
          {metrics.map((item) => {
            return (
              <div
                draggable
                onDragEnd={onDragEnd}
                onDragStart={(e) => onDragStart(e, item)}
                key={item}
                className={cn("flex items-center gap-2 rounded-lg bg-gray-50 border p-2 px-4 cursor-pointer", dragGroupElement?.type === item && "opacity-30")}
              >
                <HashtagSquare size={15} />
                <p className="font-normal text-sm line-clamp-1">{item}</p>
              </div>
            );
          })}
        </div> */}
      </ScrollArea>
    </div>
  );
};
