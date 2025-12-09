import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Bell,
  Settings2,
  CreditCard,
  Truck,
  Mail,
  Package,
} from "lucide-react";
import BusinessTab from "./tabs/BusinessTab";
import NotificationsTab from "./tabs/NotificationsTab";
import SystemTab from "./tabs/SystemTab";
import PaymentTab from "./tabs/PaymentTab";
import ShippingTab from "./tabs/ShippingTab";
import EmailTab from "./tabs/EmailTab";
import SubscriptionTab from "./tabs/SubscriptionTab";
import permissions from "@/lib/permissions";
import { withPermission } from "@/hoc/withPermission";

function Settings() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("settings.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("settings.description")}
        </p>
      </div>

      <Tabs defaultValue="business" className="w-full mt-3">
        <TabsList className="flex flex-wrap lg:justify-between lg:grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.business.tab")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.notifications.tab")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.system.tab")}</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.payment.tab")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.shipping.tab")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.email.tab")}</span>
          </TabsTrigger>
          {/* <TabsTrigger value="subscription" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.subscription.tab")}
            </span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="business" className="space-y-3">
          <BusinessTab />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-3">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="system" className="space-y-3">
          <SystemTab />
        </TabsContent>

        <TabsContent value="payment" className="space-y-3">
          <PaymentTab />
        </TabsContent>

        <TabsContent value="shipping" className="space-y-3">
          <ShippingTab />
        </TabsContent>

        <TabsContent value="email" className="space-y-3">
          <EmailTab />
        </TabsContent>

        {/* <TabsContent value="subscription" className="space-y-3">
          <SubscriptionTab />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}

export default withPermission(Settings, permissions.settings.view);
