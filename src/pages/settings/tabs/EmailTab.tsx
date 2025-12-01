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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EmailTab() {
  const { t } = useTranslation();

  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [fromEmail, setFromEmail] = useState("noreply@example.com");
  const [fromName, setFromName] = useState("My Store");

  const handleSave = () => {
    toast.success(t("settings.messages.emailSaved"));
  };

  const handleTestEmail = () => {
    toast.success(t("settings.email.testEmailSent"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.email.title")}</CardTitle>
        <CardDescription>{t("settings.email.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
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

        <div className="grid gap-4 md:grid-cols-2">
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
          <Button onClick={handleSave}>{t("settings.actions.save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
