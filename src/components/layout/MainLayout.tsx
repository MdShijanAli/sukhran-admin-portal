import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebarStore } from "@/stores/sidebarStore";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import RouteChangeListener from "../RouteChangeListener";

export default function MainLayout() {
  const { isCollapsed, setCollapsed } = useSidebarStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  return (
    <div className="min-h-screen bg-background">
      <RouteChangeListener />
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
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
