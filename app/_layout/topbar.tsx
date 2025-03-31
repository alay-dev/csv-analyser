import { Button, buttonVariants } from "@/components/ui/button";
import { CSVRow, useDataStore } from "@/store/data";
import { useAppStore } from "@/store/main";
import { ChangeEvent } from "react";
import { CloseCircle, Home } from "solar-icon-set";
import Papa from "papaparse";

const Topbar = () => {
  const { setFileName, fileName, setData } = useDataStore();

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
  );
};

export default Topbar;
