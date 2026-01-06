import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Gift,
  HeadphonesIcon,
  Heart,
  Ticket,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  Coins,
  MapPin,
  Settings2,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSidebarStore } from "@/stores/sidebarStore";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themeStore";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useState, useMemo } from "react";
import { Input } from "../ui/input";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "nav.dashboard",
    path: "/dashboard",
    permission: permissions.dashboard.view,
  },
  {
    icon: Package,
    label: "nav.products",
    path: "/products",
    permission: permissions.products.view,
  },
  {
    icon: FileText,
    label: "nav.brands",
    path: "/brands",
    permission: permissions.brands.view,
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
    permission: "",
    subItems: [
      {
        icon: Package,
        label: "nav.packages",
        path: "/packages",
        permission: permissions.packages.view,
      },
      {
        icon: Settings2,
        label: "nav.packageSettings",
        path: "/package/settings",
        permission: permissions.settings.view,
      },
    ],
  },
  {
    icon: ShoppingCart,
    label: "nav.orders",
    path: "/orders",
    permission: permissions.orders.view,
  },
  // {
  //   icon: Truck,
  //   label: "nav.delivery",
  //   path: "/delivery",
  //   permission: permissions.delivery.view,
  // },
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
    label: "nav.coinManagement",
    path: "/coin-management",
    permission: permissions.coinManagement.view,
  },
  // {
  //   icon: Mail,
  //   label: "nav.marketing",
  //   path: "/marketing",
  //   permission: permissions.marketing.view,
  // },
  {
    icon: HeadphonesIcon,
    label: "nav.support",
    path: "/support",
    permission: permissions.support.view,
  },
  // {
  //   icon: BarChart3,
  //   label: "nav.analytics",
  //   path: "/analytics",
  //   permission: permissions.analytics.view,
  // },
  {
    icon: Ticket,
    label: "nav.coupons",
    path: "/coupons",
    permission: permissions.coupons.view,
  },
  // {
  //   icon: FileText,
  //   label: "nav.content",
  //   path: "/content-management",
  //   permission: permissions.content.view,
  // },
  // {
  //   icon: UserPlus,
  //   label: "nav.family",
  //   path: "/family",
  //   permission: permissions.family.view,
  // },
  // {
  //   icon: RefreshCw,
  //   label: "nav.returns",
  //   path: "/returns",
  //   permission: permissions.returns.view,
  // },
  {
    icon: Heart,
    label: "nav.donations",
    path: "/donations",
    permission: permissions.donations.view,
  },
  {
    icon: FileText,
    label: "nav.referrals",
    path: "/referrals",
    permission: permissions.referrals.view,
  },
  {
    icon: Bell,
    label: "nav.notificationsSettings",
    path: "/notification-settings",
    permission: permissions.notifications.view,
  },
  {
    icon: Users,
    label: "nav.usersSettings",
    path: "/users",
    permission: permissions.users.view,
    subItems: [
      {
        icon: Users,
        label: "nav.users",
        path: "/users",
        permission: permissions.users.view,
      },
      {
        icon: Shield,
        label: "nav.roles",
        path: "/role-management",
        permission: permissions.roles.view,
      },
    ],
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path)
        ? prev.filter((item) => item !== path)
        : [...prev, path]
    );
  };

  // Filter menu items based on search query
  const filteredMenuItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuItems.filter((item) => {
        // For items with subItems, check if user has permission for at least one subItem
        if (item.subItems && item.subItems.length > 0) {
          return item.subItems.some((subItem) =>
            hasPermission(subItem.permission)
          );
        }
        // For regular items, check the item's permission
        return hasPermission(item.permission);
      });
    }

    const query = searchQuery.toLowerCase();
    return menuItems
      .filter((item) => {
        // For items with subItems, check if user has permission for at least one subItem
        if (item.subItems && item.subItems.length > 0) {
          return item.subItems.some((subItem) =>
            hasPermission(subItem.permission)
          );
        }
        // For regular items, check the item's permission
        return hasPermission(item.permission);
      })
      .filter((item) => {
        // Check if parent item matches
        const labelMatches = t(item.label).toLowerCase().includes(query);

        // Check if any sub-item matches
        const subItemMatches = item.subItems?.some(
          (subItem) =>
            t(subItem.label).toLowerCase().includes(query) &&
            hasPermission(subItem.permission)
        );

        return labelMatches || subItemMatches;
      })
      .map((item) => {
        // If item has sub-items, filter them too
        if (item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter(
              (subItem) =>
                hasPermission(subItem.permission) &&
                (t(item.label).toLowerCase().includes(query) ||
                  t(subItem.label).toLowerCase().includes(query))
            ),
          };
        }
        return item;
      });
  }, [searchQuery, hasPermission, t]);

  // Auto-expand items when searching if they have matching sub-items
  useMemo(() => {
    if (searchQuery.trim() && !isCollapsed) {
      const itemsToExpand: string[] = [];
      filteredMenuItems.forEach((item) => {
        if (item.subItems && item.subItems.length > 0) {
          const hasMatchingSubItem = item.subItems.some((subItem) =>
            t(subItem.label).toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (hasMatchingSubItem && !expandedItems.includes(item.path)) {
            itemsToExpand.push(item.path);
          }
        }
      });
      if (itemsToExpand.length > 0) {
        setExpandedItems((prev) => [...new Set([...prev, ...itemsToExpand])]);
      }
    }
  }, [searchQuery, filteredMenuItems, isCollapsed, t, expandedItems]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-primary border-r border-primary/20",
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
          } items-center justify-between border-white/10 px-4 transition-all duration-500 ease-in-out`}
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
            } hidden lg:block -right-4 transform -translate-y-1/2 rounded-lg p-1 bg-white shadow-md transition-all duration-500 ease-in-out hover:scale-110`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-primary" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-primary" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-3 py-2 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
              <Input
                type="text"
                placeholder={t("nav.searchMenu") || "Search menu..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9 bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus-visible:ring-1 focus-visible:ring-white/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-sm transition-colors"
                >
                  <X className="h-3 w-3 text-white/70" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Collapsed Search Icon */}
        {isCollapsed && (
          <div className="px-2 py-2 border-b border-white/10 flex justify-center">
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Search className="h-5 w-5 text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {t("nav.searchMenu") || "Expand to search"}
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
          <ul className="space-y-1 px-2">
            {filteredMenuItems.length === 0 ? (
              <li className="px-3 py-8 text-center">
                <p className="text-sm text-white/60">
                  {t("nav.noMenuFound") || "No menu items found"}
                </p>
              </li>
            ) : (
              filteredMenuItems.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedItems.includes(item.path);

                return (
                  <li key={item.path}>
                    {hasSubItems ? (
                      <>
                        {/* Parent Item with Submenu */}
                        {isCollapsed ? (
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleExpand(item.path)}
                                className={cn(
                                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ease-in-out",
                                  "hover:bg-white/10",
                                  "text-white"
                                )}
                              >
                                <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ease-in-out text-white" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="p-0">
                              <div className="flex flex-col min-w-[180px]">
                                <div className="px-3 py-2 font-medium border-b">
                                  {t(item.label)}
                                </div>
                                <ul className="py-1">
                                  {item.subItems
                                    ?.filter((subItem) =>
                                      hasPermission(subItem.permission)
                                    )
                                    .map((subItem) => (
                                      <li key={subItem.path}>
                                        <NavLink
                                          to={subItem.path}
                                          className={({ isActive }) =>
                                            cn(
                                              "flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                                              "hover:bg-accent",
                                              isActive
                                                ? "bg-accent font-medium"
                                                : ""
                                            )
                                          }
                                        >
                                          <subItem.icon className="h-4 w-4 flex-shrink-0" />
                                          <span>{t(subItem.label)}</span>
                                        </NavLink>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <button
                            onClick={() => toggleExpand(item.path)}
                            className={cn(
                              "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ease-in-out",
                              "hover:bg-white/10 hover:text-white",
                              "text-white/90"
                            )}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-300 ease-in-out" />
                            <span className="flex-1 text-left transition-opacity duration-300 ease-in-out">
                              {t(item.label)}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 transition-transform duration-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 transition-transform duration-500" />
                            )}
                          </button>
                        )}

                        {/* Submenu Items */}
                        {!isCollapsed && (
                          <div
                            className={cn(
                              "overflow-hidden transition-all duration-500 ease-in-out",
                              isExpanded
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0"
                            )}
                          >
                            <ul className="mt-1 space-y-1 ml-4 pl-4 border-l-2 border-white/20">
                              {item.subItems
                                ?.filter((subItem) =>
                                  hasPermission(subItem.permission)
                                )
                                .map((subItem) => (
                                  <li key={subItem.path}>
                                    <NavLink
                                      to={subItem.path}
                                      className={({ isActive }) =>
                                        cn(
                                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 ease-in-out",
                                          "hover:bg-white/10 hover:text-white",
                                          isActive
                                            ? "bg-white/20 text-white font-medium"
                                            : "text-white/80"
                                        )
                                      }
                                    >
                                      <subItem.icon className="h-4 w-4 flex-shrink-0" />
                                      <span className="transition-opacity duration-300 ease-in-out">
                                        {t(subItem.label)}
                                      </span>
                                    </NavLink>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Regular Item without Submenu */
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ease-in-out",
                            "hover:bg-white/10 hover:text-white",
                            isActive
                              ? "bg-white/20 text-white font-medium"
                              : "text-white/90"
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
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
