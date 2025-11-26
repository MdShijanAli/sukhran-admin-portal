import {
  Moon,
  Sun,
  Globe,
  Bell,
  LogOut,
  User,
  Package,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import authService from "@/services/authService";
import { toast } from "sonner";
import { Notification } from "@/lib/types";
import ENFlag from "@/assets/images/en.png";
import BNFlag from "@/assets/images/bn.png";

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-2024-156 from Ahmed Hassan",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    message: "৳2,500 received from Fatima Khan",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "delivery",
    title: "Delivery Completed",
    message: "Order #ORD-2024-155 delivered successfully",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    type: "alert",
    title: "Low Stock Alert",
    message: "Fresh Milk 1L is running low",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "order",
    title: "Order Cancelled",
    message: "Order #ORD-2024-154 cancelled by customer",
    time: "3 hours ago",
    read: true,
  },
];

const notificationIcons = {
  order: Package,
  payment: DollarSign,
  delivery: Package,
  alert: AlertCircle,
};

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme, setLanguage } = useThemeStore();
  const { user } = useAuthStore();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "bn" : "en";
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      console.log("Logout response:", response);

      if (response && response.success) {
        toast.success("Logged out successfully");
        navigate("/login");
      } else {
        toast.error(response?.message || "Logout failed");
      }
    } catch (error: unknown) {
      console.error("Logout error:", error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || "An error occurred during logout");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex flex-1 items-center justify-end gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "light" ? (
            <Moon className="h-8 w-8" />
          ) : (
            <Sun className="h-8 w-8" />
          )}
        </Button>

        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className="rounded-full"
          title={
            i18n.language === "en" ? "Switch to বাংলা" : "Switch to English"
          }
        >
          {i18n.language === "en" ? (
            <img
              src={ENFlag}
              alt="English"
              className="h-6 w-6 rounded-full object-cover object-center"
            />
          ) : (
            <img
              src={BNFlag}
              alt="Bangla"
              className="h-6 w-6 rounded-full object-cover object-center"
            />
          )}
          <span className="sr-only">Toggle language</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
            >
              <Bell className="h-8 w-8" />
              {mockNotifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-popover" align="end">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {mockNotifications.filter((n) => !n.read).length > 0 && (
                <Badge
                  variant="destructive"
                  className="rounded-full h-5 w-5 p-0 flex items-center justify-center"
                >
                  {mockNotifications.filter((n) => !n.read).length}
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[400px]">
              {mockNotifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer ${
                      !notification.read ? "bg-accent/50" : ""
                    }`}
                  >
                    <div
                      className={`mt-1 rounded-full p-2 ${
                        notification.type === "alert"
                          ? "bg-destructive/10 text-destructive"
                          : notification.type === "payment"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center cursor-pointer">
              <NavLink to="/notifications" className="w-full">
                View All Notifications
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.image_url ? (
                    <img
                      src={user.image_url}
                      alt={user.firstName}
                      className="w-full h-full object-cover object-top border-2 border-primary rounded-full"
                    />
                  ) : (
                    getInitials(user.firstName)
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>{t("nav.profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
