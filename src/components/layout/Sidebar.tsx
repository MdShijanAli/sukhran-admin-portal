import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  Gift,
  HeadphonesIcon,
  BarChart3,
  Heart,
  Ticket,
  FileText,
  UserPlus,
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  Coins,
  Mail,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSidebarStore } from "@/stores/sidebarStore";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themeStore";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "nav.dashboard",
    path: "/dashboard",
    permission: permissions.dashboard.view,
  },
  {
    icon: Users,
    label: "nav.users",
    path: "/users",
    permission: permissions.users.view,
  },
  {
    icon: Package,
    label: "nav.products",
    path: "/products",
    permission: permissions.products.view,
  },
  {
    icon: FileText,
    label: "nav.categories",
    path: "/categories",
    permission: permissions.categories.view,
  },
  {
    icon: Gift,
    label: "nav.packages",
    path: "/packages",
    permission: permissions.packages.view,
  },
  {
    icon: ShoppingCart,
    label: "nav.orders",
    path: "/orders",
    permission: permissions.orders.view,
  },
  {
    icon: Truck,
    label: "nav.delivery",
    path: "/delivery",
    permission: permissions.delivery.view,
  },
  {
    icon: MapPin,
    label: "nav.coverageAreas",
    path: "/coverage-areas",
    permission: permissions.coverageAreas.view,
  },
  {
    icon: DollarSign,
    label: "nav.transactions",
    path: "/transactions",
    permission: permissions.transactions.view,
  },
  {
    icon: Coins,
    label: "nav.loyaltyRewards",
    path: "/loyalty-rewards",
    permission: permissions.loyaltyRewards.view,
  },
  {
    icon: Mail,
    label: "nav.marketing",
    path: "/marketing",
    permission: permissions.marketing.view,
  },
  {
    icon: HeadphonesIcon,
    label: "nav.support",
    path: "/support",
    permission: permissions.support.view,
  },
  {
    icon: BarChart3,
    label: "nav.analytics",
    path: "/analytics",
    permission: permissions.analytics.view,
  },
  {
    icon: Ticket,
    label: "nav.coupons",
    path: "/coupons",
    permission: permissions.coupons.view,
  },
  {
    icon: FileText,
    label: "nav.content",
    path: "/content-management",
    permission: permissions.content.view,
  },
  {
    icon: UserPlus,
    label: "nav.family",
    path: "/family",
    permission: permissions.family.view,
  },
  // {
  //   icon: RefreshCw,
  //   label: "nav.returns",
  //   path: "/returns",
  //   permission: permissions.returns.view,
  // },
  {
    icon: Shield,
    label: "nav.roles",
    path: "/role-management",
    permission: permissions.roles.view,
  },
  {
    icon: Bell,
    label: "nav.notifications",
    path: "/notifications",
    permission: permissions.notifications.view,
  },
  {
    icon: Settings,
    label: "nav.settings",
    path: "/settings",
    permission: permissions.settings.view,
  },
  {
    icon: FileText,
    label: "nav.reports",
    path: "/reports",
    permission: permissions.reports.view,
  },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { language } = useThemeStore();
  const { hasPermission } = usePermissions();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border",
        isCollapsed ? "w-18" : "w-64"
      )}
      style={{
        transition: "width 0.7s ease-in-out",
      }}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={`relative flex ${
            isCollapsed ? "h-16 border-b" : "h-32"
          } items-center justify-between border-sidebar-border px-4 transition-all duration-500 ease-in-out`}
        >
          <img
            src={
              language === "en" ? "/images/Skr-eng.png" : "/images/Skr-bng.png"
            }
            alt="Shukran Admin Portal"
            className={`mx-auto transition-all duration-500 ease-in-out ${
              isCollapsed ? "w-10" : "h-28 w-100"
            }`}
          />
          <button
            onClick={toggleSidebar}
            className={`absolute ${
              isCollapsed ? "top-1/2" : "top-8"
            } hidden lg:block -right-4 transform -translate-y-1/2 rounded-lg p-1 bg-sidebar-accent transition-all duration-500 ease-in-out hover:scale-110`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-sidebar-foreground" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-sidebar-accent [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-sidebar-accent/80">
          <ul className="space-y-1 px-2">
            {menuItems
              .filter((item) => hasPermission(item.permission))
              .map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ease-in-out",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground"
                      )
                    }
                  >
                    {isCollapsed ? (
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ease-in-out" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {t(item.label)}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ease-in-out" />
                    )}
                    {!isCollapsed && (
                      <span className="transition-opacity duration-300 ease-in-out">
                        {t(item.label)}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
