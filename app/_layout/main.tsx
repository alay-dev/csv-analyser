import Sidebar from "./sidebar";
import Topbar from "./topbar";

const layoutStyles = { height: "calc(100% - 3rem)", top: "3rem", left: 0 };

const Main = ({ children }: { children: React.ReactElement }) => {
  return (
    <main className="h-screen bg-foreground">
      <Topbar />
      <div style={layoutStyles} className="relative text-black flex items-center justify-between ">
        <Sidebar />
        {children}
      </div>
    </main>
  );
};

export default Main;
