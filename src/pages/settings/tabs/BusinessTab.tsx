import { useState, useEffect } from "react";
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
import settingsService from "@/services/settingsService";
import { Skeleton } from "@/components/ui/skeleton";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

export default function BusinessTab() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [businessName, setBusinessName] = useState("My E-Commerce Store");
  const [businessEmail, setBusinessEmail] = useState("business@example.com");
  const [businessPhone, setBusinessPhone] = useState("+880 1712-345678");
  const [businessAddress, setBusinessAddress] = useState(
    "123 Main Street, Dhaka"
  );
  const [taxId, setTaxId] = useState("TAX123456");
  const [currency, setCurrency] = useState("BDT");
  const [timezone, setTimezone] = useState("Asia/Dhaka");

  // API Settings
  const [vatPercentage, setVatPercentage] = useState<number>(0);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [minCustomPackageAmount, setMinCustomPackageAmount] =
    useState<number>(0);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsService.getGeneralSettings();

      if (response && response.success) {
        response.data.forEach((group) => {
          if (group.group === "pricing") {
            group.settings.forEach((setting) => {
              if (setting.key === "vat_percentage") {
                setVatPercentage(Number(setting.value));
              } else if (setting.key === "min_order_amount") {
                setMinOrderAmount(Number(setting.value));
              }
            });
          } else if (group.group === "package") {
            group.settings.forEach((setting) => {
              if (setting.key === "min_custom_package_amount") {
                setMinCustomPackageAmount(Number(setting.value));
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

  const handleSaveVAT = async () => {
    try {
      setIsSaving(true);
      await settingsService.updateSetting("vat_percentage", vatPercentage);
      toast.success(t("settings.messages.businessSettingsSaved"));
    } catch (error) {
      console.error("Error saving VAT:", error);
      toast.error(t("settings.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMinOrder = async () => {
    try {
      setIsSaving(true);
      await settingsService.updateSetting("min_order_amount", minOrderAmount);
      toast.success(t("settings.messages.businessSettingsSaved"));
    } catch (error) {
      console.error("Error saving min order:", error);
      toast.error(t("settings.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMinPackage = async () => {
    try {
      setIsSaving(true);
      await settingsService.updateSetting(
        "min_custom_package_amount",
        minCustomPackageAmount
      );
      toast.success(t("settings.messages.businessSettingsSaved"));
    } catch (error) {
      console.error("Error saving min package:", error);
      toast.error(t("settings.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    toast.success(t("settings.messages.businessSettingsSaved"));
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
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.business.title")}</CardTitle>
          <CardDescription>
            {t("settings.business.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="businessAddress">
              {t("settings.business.businessAddress")}
            </Label>
            <Input
              id="businessAddress"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
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
          <div className="flex justify-end">
            {hasPermission(permissions.settings.edit) && (
              <Button onClick={handleSave} disabled={isSaving}>
                {t("settings.actions.save")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.business.regional")}</CardTitle>
            <CardDescription>
              {t("settings.business.regionalDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">
                {t("settings.business.currency")}
              </Label>
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
              <Label htmlFor="timezone">
                {t("settings.business.timezone")}
              </Label>
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
            <div className="flex justify-end">
              {hasPermission(permissions.settings.edit) && (
                <Button onClick={handleSave} disabled={isSaving}>
                  {t("settings.actions.save")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.business.pricing")}</CardTitle>
            <CardDescription>
              {t("settings.business.pricingDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vatPercentage">
                {t("settings.business.vatPercentage")}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="vatPercentage"
                  type="number"
                  step="0.1"
                  value={vatPercentage}
                  onChange={(e) => setVatPercentage(Number(e.target.value))}
                />
                {hasPermission(permissions.settings.edit) && (
                  <Button onClick={handleSaveVAT} disabled={isSaving}>
                    {t("settings.actions.save")}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("settings.business.vatDescription")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderAmount">
                {t("settings.business.minOrderAmount")}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="minOrderAmount"
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                />
                {hasPermission(permissions.settings.edit) && (
                  <Button onClick={handleSaveMinOrder} disabled={isSaving}>
                    {t("settings.actions.save")}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("settings.business.minOrderDescription")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
