import { useAppStore } from "@/store/main";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

import { useDataStore } from "@/store/data";
import { CSVUploadModal } from "../builder/_modal/upload-csv";
import { env } from "process";
import { InitDashboardModal } from "../builder/_modal/init-dashboard";

const layoutStyles = { height: "calc(100% - 3rem)", top: "3rem", left: 0 };

const Main = ({ children }: { children: React.ReactElement }) => {
  const fileName = useDataStore((state) => state.fileData?.fileName);
  const isInitialized = useAppStore((state) => state.isInitialized);
  const currentTag = useDataStore((state) => state.currentTag);

  return (
    <main className="h-screen bg-foreground">
      <Topbar />
      <div style={layoutStyles} className="relative text-black flex items-center justify-between ">
        <Sidebar />
        {children}
      </div>

      <CSVUploadModal
        open={!fileName}
        onOpenChange={() => {}} // Empty function makes it non-closeable
        closeable={false}
      />

      <InitDashboardModal open={!isInitialized && !!currentTag?.sessionID} onOpenChange={() => {}} />
    </main>
  );
};

export default Main;
