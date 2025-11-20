import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebarStore } from "@/stores/sidebarStore";
import { cn } from "@/lib/utils";

export default function MainLayout() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(isCollapsed ? "ml-[4.5rem]" : "ml-64")}
        style={{
          transition: "margin-left 0.7s ease-in-out",
        }}
      >
        <Header />
        <main
          className={`transition-all duration-500 ease-in-out ${
            isCollapsed ? "p-3" : "p-3"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
