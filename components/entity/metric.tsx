import { useDataStore } from "@/store/data";
import { useMemo } from "react";

const Metric = ({ label, selected }: { label: string; selected: boolean }) => {
  const { data } = useDataStore();

  console.log(label, data, "DATA");
  const overallData = useMemo(() => {
    return data?.reduce((total, item) => total + +item[label], 0) || 0;
  }, [data, label]);

  return (
    <div className="min-w-40">
      <h4 className="text-gray-500">{label}</h4>
      <p className="font-semibold text-xl">{overallData.toLocaleString("en-US")}</p>
    </div>
  );
};

export default Metric;
