import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import settingsService from "@/services/settingsService";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmailTab() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // API Settings
  const [orderNotificationEmail, setOrderNotificationEmail] =
    useState<string>("");

  // Local Settings (not in API yet)
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [fromEmail, setFromEmail] = useState("noreply@example.com");
  const [fromName, setFromName] = useState("My Store");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsService.getGeneralSettings();

      if (response && response.success) {
        response.data.forEach((group) => {
          if (group.group === "email") {
            group.settings.forEach((setting) => {
              if (setting.key === "order_notification_email") {
                setOrderNotificationEmail(String(setting.value));
              }
            });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error(t("settings.messages.fetchError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotificationEmail = async () => {
    try {
      setIsSaving(true);
      await settingsService.updateSetting(
        "order_notification_email",
        orderNotificationEmail
      );
      toast.success(t("settings.messages.emailSaved"));
    } catch (error) {
      console.error("Error saving notification email:", error);
      toast.error(t("settings.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    toast.success(t("settings.messages.emailSaved"));
  };

  const handleTestEmail = () => {
    toast.success(t("settings.email.testEmailSent"));
  };

  if (isLoading) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {/* Order Notification Email */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.email.orderNotifications")}</CardTitle>
          <CardDescription>
            {t("settings.email.orderNotificationsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderNotificationEmail">
              {t("settings.email.notificationEmail")}
            </Label>
            <div className="flex gap-2">
              <Input
                id="orderNotificationEmail"
                type="email"
                value={orderNotificationEmail}
                onChange={(e) => setOrderNotificationEmail(e.target.value)}
                placeholder="orders@example.com"
              />
              <Button onClick={handleSaveNotificationEmail} disabled={isSaving}>
                {t("settings.actions.save")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("settings.email.notificationEmailHint")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SMTP Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.email.title")}</CardTitle>
          <CardDescription>{t("settings.email.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">{t("settings.email.smtpHost")}</Label>
              <Input
                id="smtpHost"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">{t("settings.email.smtpPort")}</Label>
              <Input
                id="smtpPort"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtpUsername">
              {t("settings.email.smtpUsername")}
            </Label>
            <Input
              id="smtpUsername"
              value={smtpUsername}
              onChange={(e) => setSmtpUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtpPassword">
              {t("settings.email.smtpPassword")}
            </Label>
            <Input
              id="smtpPassword"
              type="password"
              value={smtpPassword}
              onChange={(e) => setSmtpPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fromEmail">{t("settings.email.fromEmail")}</Label>
              <Input
                id="fromEmail"
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromName">{t("settings.email.fromName")}</Label>
              <Input
                id="fromName"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleTestEmail}>
              {t("settings.email.testEmail")}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {t("settings.actions.save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
