import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NotificationsTab() {
  const { t } = useTranslation();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [customerSignups, setCustomerSignups] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  const handleSave = () => {
    toast.success(t("settings.messages.notificationsSaved"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.notifications.title")}</CardTitle>
        <CardDescription>
          {t("settings.notifications.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.notifications.emailNotifications")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.notifications.emailNotificationsDesc")}
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.notifications.orderNotifications")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.notifications.orderNotificationsDesc")}
            </p>
          </div>
          <Switch
            checked={orderNotifications}
            onCheckedChange={setOrderNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.notifications.lowStockAlerts")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.notifications.lowStockAlertsDesc")}
            </p>
          </div>
          <Switch
            checked={lowStockAlerts}
            onCheckedChange={setLowStockAlerts}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.notifications.customerSignups")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.notifications.customerSignupsDesc")}
            </p>
          </div>
          <Switch
            checked={customerSignups}
            onCheckedChange={setCustomerSignups}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.notifications.weeklyReports")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.notifications.weeklyReportsDesc")}
            </p>
          </div>
          <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.notifications.paymentAlerts")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.notifications.paymentAlertsDesc")}
            </p>
          </div>
          <Switch checked={paymentAlerts} onCheckedChange={setPaymentAlerts} />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>{t("settings.actions.save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
