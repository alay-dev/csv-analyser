import { demoData, demoFileName, demoNodes } from "@/constants/demo";
import { useDataStore } from "@/store/data";
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

const useLoadDemo = ({ isCanvasInitialized }: { isCanvasInitialized: boolean }) => {
  const { setData, setFileName } = useDataStore();
  const { setNodes } = useReactFlow();

  useEffect(() => {
    if (!isCanvasInitialized) return;
    setData(demoData);
    setFileName(demoFileName);
    setNodes(demoNodes);
  }, [isCanvasInitialized, setData, setFileName, setNodes]);
};

export default useLoadDemo;
