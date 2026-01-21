import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Bell, Settings2, Truck, Shield, Image } from "lucide-react";
import BusinessTab from "./tabs/BusinessTab";
import NotificationsTab from "./tabs/NotificationsTab";
import SystemTab from "./tabs/SystemTab";
import PaymentTab from "./tabs/PaymentTab";
import ShippingTab from "./tabs/ShippingTab";
import EmailTab from "./tabs/EmailTab";
import SubscriptionTab from "./tabs/SubscriptionTab";
import LegalTab from "./tabs/LegalTab";
import permissions from "@/lib/permissions";
import { withPermission } from "@/hoc/withPermission";
import usePermissions from "@/hooks/use-permissions";

function Settings() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const tabLists = [
    {
      id: "business",
      label: t("settings.business.tab"),
      icon: Building2,
      permission: permissions.settings.view,
    },
    // {
    //   id: "notifications",
    //   label: t("settings.notifications.tab"),
    //   icon: Bell,
    // },
    // {
    //   id: "system",
    //   label: t("settings.system.tab"),
    //   icon: Settings2,
    // },
    // {
    //   id: "payment",
    //   label: t("settings.payment.tab"),
    //   icon: CreditCard,
    // },
    {
      id: "shipping",
      label: t("settings.shipping.tab"),
      icon: Truck,
      permission: permissions.settings.view,
    },
    {
      id: "legal",
      label: t("settings.terms_condition.tab"),
      icon: Shield,
      permission: permissions.legal_documents.view,
    },
    // {
  ];

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold ">{t("settings.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("settings.description")}
        </p>
      </div>

      <Tabs defaultValue="business" className="mt-3">
        <TabsList className="flex flex-wrap gap-2 justify-start">
          {tabLists.map(
            (tab) =>
              hasPermission(tab.permission) && (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ),
          )}
          {/* <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.email.tab")}</span>
          </TabsTrigger> */}
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

        {/* <TabsContent value="notifications" className="space-y-3">
          <NotificationsTab />
        </TabsContent> */}

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

        <TabsContent value="legal" className="space-y-3">
          <LegalTab />
        </TabsContent>

        {/* <TabsContent value="subscription" className="space-y-3">
          <SubscriptionTab />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}

export default withPermission(Settings, permissions.settings.view);
