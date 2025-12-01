import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function BusinessTab() {
  const { t } = useTranslation();

  const [businessName, setBusinessName] = useState("My E-Commerce Store");
  const [businessEmail, setBusinessEmail] = useState("business@example.com");
  const [businessPhone, setBusinessPhone] = useState("+880 1712-345678");
  const [businessAddress, setBusinessAddress] = useState(
    "123 Main Street, Dhaka"
  );
  const [taxId, setTaxId] = useState("TAX123456");
  const [currency, setCurrency] = useState("BDT");
  const [timezone, setTimezone] = useState("Asia/Dhaka");

  const handleSave = () => {
    toast.success(t("settings.messages.businessSettingsSaved"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.business.title")}</CardTitle>
        <CardDescription>{t("settings.business.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="businessName">
              {t("settings.business.businessName")}
            </Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessEmail">
              {t("settings.business.businessEmail")}
            </Label>
            <Input
              id="businessEmail"
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="businessPhone">
              {t("settings.business.businessPhone")}
            </Label>
            <Input
              id="businessPhone"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">{t("settings.business.taxId")}</Label>
            <Input
              id="taxId"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessAddress">
            {t("settings.business.businessAddress")}
          </Label>
          <Input
            id="businessAddress"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency">{t("settings.business.currency")}</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BDT">BDT - Bangladeshi Taka</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">{t("settings.business.timezone")}</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Dhaka">Asia/Dhaka</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>{t("settings.actions.save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
