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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import settingsService from "@/services/settingsService";
import { Skeleton } from "@/components/ui/skeleton";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

export default function ShippingTab() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // API Settings
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(0);
  const [enableFreeShipping, setEnableFreeShipping] = useState<boolean>(false);
  const [isDeliveryDateSaving, setIsDeliveryDateSaving] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<number>(0);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsService.getGeneralSettings();

      if (response && response.success) {
        response.data.forEach((group) => {
          if (group.group === "delivery") {
            group.settings.forEach((setting) => {
              if (setting.key === "delivery_charge") {
                setDeliveryCharge(Number(setting.value));
              } else if (setting.key === "free_delivery_threshold") {
                setFreeShippingThreshold(Number(setting.value));
              } else if (setting.key === "enable_free_delivery") {
                setEnableFreeShipping(Boolean(setting.value));
              } else if (setting.key === "min_delivery_lead_time_days") {
                setDeliveryDate(Number(setting.value));
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

  const handleSaveDeliveryCharge = async () => {
    try {
      setIsSaving(true);
      await settingsService.updateSetting("delivery_charge", deliveryCharge);
      toast.success(t("settings.messages.shippingSaved"));
    } catch (error) {
      console.error("Error saving delivery charge:", error);
      toast.error(t("settings.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFreeShipping = async () => {
    try {
      setIsSaving(true);
      await settingsService.updateSetting(
        "free_delivery_threshold",
        freeShippingThreshold
      );
      toast.success(t("settings.messages.shippingSaved"));
    } catch (error) {
      console.error("Error saving free shipping threshold:", error);
      toast.error(t("settings.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFreeShipping = async (checked: boolean) => {
    try {
      setEnableFreeShipping(checked);
      await settingsService.updateSetting("enable_free_delivery", checked);
      toast.success(t("settings.messages.shippingSaved"));
    } catch (error) {
      console.error("Error toggling free shipping:", error);
      toast.error(t("settings.messages.saveError"));
      setEnableFreeShipping(!checked);
    }
  };

  const handleSaveDeliveryDate = async () => {
    try {
      setIsDeliveryDateSaving(true);
      await settingsService.updateDeliveryDate(deliveryDate);
      toast.success(t("settings.messages.businessSettingsSaved"));
    } catch (error) {
      console.error("Error saving delivery date:", error);
      toast.error(
        error.response?.data?.message || t("settings.messages.saveError")
      );
    } finally {
      setIsDeliveryDateSaving(false);
    }
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
      {/* Delivery Charge */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.shipping.deliveryCharge")}</CardTitle>
          <CardDescription>
            {t("settings.shipping.deliveryChargeDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="deliveryCharge">
              {t("settings.shipping.chargeAmount")}
            </Label>
            <div className="flex gap-2">
              <Input
                id="deliveryCharge"
                type="number"
                step="0.01"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(Number(e.target.value))}
              />
              {hasPermission(permissions.settings.edit) && (
                <Button onClick={handleSaveDeliveryCharge} disabled={isSaving}>
                  {t("settings.actions.save")}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("settings.shipping.chargeHint")}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.business.deliveryDate")}</CardTitle>
            <CardDescription>
              {t("settings.business.deliveryDateDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minDeliveryDate">
                {t("settings.business.minDeliveryDate")}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="minDeliveryDate"
                  type="number"
                  step="0.1"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(Number(e.target.value))}
                />
                {hasPermission(permissions.settings.edit) && (
                  <Button onClick={handleSaveDeliveryDate} disabled={isSaving}>
                    {isDeliveryDateSaving
                      ? t("settings.actions.saving")
                      : t("settings.actions.save")}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("settings.business.minDeliveryDateDescription")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Free Shipping Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.shipping.freeShipping")}</CardTitle>
          <CardDescription>
            {t("settings.shipping.freeShippingDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableFreeShipping">
                {t("settings.shipping.enableFreeShipping")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.shipping.enableFreeShippingDescription")}
              </p>
            </div>
            <Switch
              id="enableFreeShipping"
              checked={enableFreeShipping}
              onCheckedChange={handleToggleFreeShipping}
            />
          </div>

          {enableFreeShipping && (
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">
                {t("settings.shipping.freeShippingThreshold")}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) =>
                    setFreeShippingThreshold(Number(e.target.value))
                  }
                />
                {hasPermission(permissions.settings.edit) && (
                  <Button onClick={handleSaveFreeShipping} disabled={isSaving}>
                    {t("settings.actions.save")}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("settings.shipping.thresholdHint")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Methods */}
      {/* <Card>
        <CardHeader>
          <CardTitle>{t("settings.shipping.methods")}</CardTitle>
          <CardDescription>
            {t("settings.shipping.methodsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="defaultShippingMethod">
              {t("settings.shipping.defaultMethod")}
            </Label>
            <Select
              value={defaultShippingMethod}
              onValueChange={setDefaultShippingMethod}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">
                  {t("settings.shipping.standard")}
                </SelectItem>
                <SelectItem value="express">
                  {t("settings.shipping.express")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {t("settings.actions.save")}
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
