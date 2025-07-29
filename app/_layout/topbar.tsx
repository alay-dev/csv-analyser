import { Button, buttonVariants } from "@/components/ui/button";
import { CSVRow, useDataStore } from "@/store/data";
import { useAppStore } from "@/store/main";
import { ChangeEvent, useState } from "react";
import { CloseCircle, Home } from "solar-icon-set";
import Papa from "papaparse";
import { cn } from "@/lib/utils";

const Topbar = () => {
  const { setFileName, fileName, setData } = useDataStore();
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analysisOptions = [
    { id: "analysis1", label: "Sales Analysis" },
    { id: "analysis2", label: "Trend Analysis" },
    { id: "analysis3", label: "Performance Metrics" },
    { id: "analysis4", label: "Customer Insights" },
    { id: "analysis5", label: "Revenue Breakdown" },
  ];

  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setData(results.data);
        setFileName(file.name);
      },
      error: function (error) {
        console.error("Error parsing the CSV file: ", error);
      },
    });
    e.target.value = "";
  };

  return (
    <div className="w-full px-1 py-2 fixed top-0 z-10 h-[3rem] text-white flex items-center justify-between pr-6">
      <div className="h-full flex items-center px-3 mt-2">
        <Home size={20} />
      </div>
      <div className="flex items-center justify-between w-full ml-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {fileName &&
            analysisOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedAnalysis(selectedAnalysis === option.id ? null : option.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300 border backdrop-blur-md",
                  selectedAnalysis === option.id ? "bg-white/10 text-white border-white/60 shadow-lg backdrop-blur-lg" : "bg-white/5 text-white/80 border-white/10 hover:bg-white/15 hover:border-white/25 hover:text-white"
                )}
              >
                {option.label}
              </button>
            ))}
          <button
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300 border backdrop-blur-md",
              "bg-white/5 text-white/80 border-white/10 hover:bg-white/15 hover:border-white/25 hover:text-white"
            )}
          >
            +
          </button>
        </div>
        {fileName ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">{fileName}</span>
            <label htmlFor="csv-change">
              <span className={buttonVariants()}>Change</span>
              <input id="csv-change" type="file" accept=".csv" onChange={onUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <label htmlFor="csv-input">
            <span className={buttonVariants()}>Upload CSV</span>
            <input id="csv-input" type="file" accept=".csv" onChange={onUpload} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
};

export default Topbar;
