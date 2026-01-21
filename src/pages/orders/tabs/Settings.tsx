import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Settings as SettingsIcon,
  Clock,
  Calendar,
  Info,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import orderService from "@/services/orderService";

interface DeliverySettings {
  min_delivery_lead_time_days: number;
  max_delivery_lead_time_days: number;
  same_day_delivery_cutoff_hour: number;
  skip_friday_delivery: boolean;
}

const Settings = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<DeliverySettings>({
    min_delivery_lead_time_days: 3,
    max_delivery_lead_time_days: 4,
    same_day_delivery_cutoff_hour: 12,
    skip_friday_delivery: false,
  });

  const [formData, setFormData] = useState<DeliverySettings>({
    min_delivery_lead_time_days: 3,
    max_delivery_lead_time_days: 4,
    same_day_delivery_cutoff_hour: 12,
    skip_friday_delivery: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await orderService.getDeliverySettings();
      if (response && response.settings) {
        const deliveryWindow = response.settings.delivery_window;
        const cutoffTime = response.settings.cutoff_time;
        const businessDays = response.settings.business_days;

        const settingsData = {
          min_delivery_lead_time_days:
            deliveryWindow.min_delivery_lead_time_days,
          max_delivery_lead_time_days:
            deliveryWindow.max_delivery_lead_time_days,
          same_day_delivery_cutoff_hour:
            cutoffTime.same_day_delivery_cutoff_hour,
          skip_friday_delivery: businessDays.skip_friday_delivery,
        };

        setSettings(settingsData);
        setFormData(settingsData);
      }
    } catch (error) {
      console.error("Error fetching delivery settings:", error);
      toast.error(t("orders.settings.messages.failedToFetch"));
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (formData.min_delivery_lead_time_days < 1) {
      toast.error(t("orders.settings.messages.invalidMinDays"));
      return false;
    }
    if (
      formData.max_delivery_lead_time_days <=
      formData.min_delivery_lead_time_days
    ) {
      toast.error(t("orders.settings.messages.invalidMaxDays"));
      return false;
    }
    if (
      formData.same_day_delivery_cutoff_hour < 0 ||
      formData.same_day_delivery_cutoff_hour > 23
    ) {
      toast.error(t("orders.settings.messages.invalidCutoffHour"));
      return false;
    }
    return true;
  };

  const handleSaveSettings = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await orderService.updateDeliverySettings(formData);
      setSettings(formData);
      toast.success(t("orders.settings.messages.settingsUpdated"));
    } catch (error) {
      console.error("Error updating delivery settings:", error);
      toast.error(t("orders.settings.messages.failedToUpdate"));
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const calculateDeliveryExample = (isBeforeCutoff: boolean) => {
    const min = isBeforeCutoff
      ? formData.min_delivery_lead_time_days
      : formData.min_delivery_lead_time_days + 1;
    const max = isBeforeCutoff
      ? formData.max_delivery_lead_time_days
      : formData.max_delivery_lead_time_days + 1;
    return { min, max };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(formData);

  return (
    <div className="animate-fade-in space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold ">{t("orders.settings.title")}</h2>
          <p className="text-muted-foreground mt-1">
            {t("orders.settings.subtitle")}
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={!hasChanges || saving}
          size="lg"
          className="min-w-[140px]"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("orders.settings.savingSettings")}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t("orders.settings.updateSettings")}
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>{t("orders.settings.deliveryWindow")}</CardTitle>
            </div>
            <CardDescription>
              {t("orders.settings.deliveryWindowDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="min_days" className="text-base font-semibold">
                {t("orders.settings.minDeliveryDays")}
              </Label>
              <Input
                id="min_days"
                type="number"
                min="1"
                value={formData.min_delivery_lead_time_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_delivery_lead_time_days: parseInt(e.target.value) || 1,
                  })
                }
                placeholder={t("orders.settings.minDeliveryDaysPlaceholder")}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{t("orders.settings.minDeliveryDaysHelper")}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_days" className="text-base font-semibold">
                {t("orders.settings.maxDeliveryDays")}
              </Label>
              <Input
                id="max_days"
                type="number"
                min="1"
                value={formData.max_delivery_lead_time_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_delivery_lead_time_days: parseInt(e.target.value) || 1,
                  })
                }
                placeholder={t("orders.settings.maxDeliveryDaysPlaceholder")}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{t("orders.settings.maxDeliveryDaysHelper")}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>{t("orders.settings.cutoffTime")}</CardTitle>
            </div>
            <CardDescription>
              {t("orders.settings.cutoffTimeDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cutoff_hour" className="text-base font-semibold">
                {t("orders.settings.cutoffHour")}
              </Label>
              <Input
                id="cutoff_hour"
                type="number"
                min="0"
                max="23"
                value={formData.same_day_delivery_cutoff_hour}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    same_day_delivery_cutoff_hour:
                      parseInt(e.target.value) || 0,
                  })
                }
                placeholder={t("orders.settings.cutoffHourPlaceholder")}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{t("orders.settings.cutoffHourHelper")}</span>
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">
                    {t("orders.settings.skipFridayDelivery")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.settings.skipFridayDeliveryHelper")}
                  </p>
                </div>
                <Switch
                  checked={formData.skip_friday_delivery}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, skip_friday_delivery: checked })
                  }
                  className="ml-4"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <CardTitle>{t("orders.settings.currentSettings")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("orders.settings.deliveryWindowSummary")}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-base px-3 py-1">
                  {settings.min_delivery_lead_time_days}
                </Badge>
                <span className="text-muted-foreground">
                  {t("orders.settings.to")}
                </span>
                <Badge variant="default" className="text-base px-3 py-1">
                  {settings.max_delivery_lead_time_days}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {t("orders.settings.days")}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("orders.settings.cutoffTimeSummary")}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {formatTime(settings.same_day_delivery_cutoff_hour)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {t("orders.settings.hour24Format")}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("orders.settings.fridayDeliverySummary")}
              </p>
              <Badge
                variant={
                  settings.skip_friday_delivery ? "destructive" : "default"
                }
                className="text-base px-3 py-1"
              >
                {settings.skip_friday_delivery
                  ? t("orders.settings.skipped")
                  : t("orders.settings.allowed")}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>{t("orders.settings.exampleScenarios")}</CardTitle>
          <CardDescription>
            Examples based on current settings showing delivery date
            calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    {t("orders.settings.beforeCutoff")}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {t("orders.settings.orderPlacedAt")}{" "}
                    {formatTime(formData.same_day_delivery_cutoff_hour - 1)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("orders.settings.deliveryRange")}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-600">
                      {calculateDeliveryExample(true).min}{" "}
                      {t("orders.settings.days")}
                    </Badge>
                    <span className="text-xs">{t("orders.settings.to")}</span>
                    <Badge variant="default" className="bg-green-600">
                      {calculateDeliveryExample(true).max}{" "}
                      {t("orders.settings.days")}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    {t("orders.settings.afterCutoff")}
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {t("orders.settings.orderPlacedAt")}{" "}
                    {formatTime(formData.same_day_delivery_cutoff_hour + 1)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("orders.settings.deliveryRange")}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-amber-600">
                      {calculateDeliveryExample(false).min}{" "}
                      {t("orders.settings.days")}
                    </Badge>
                    <span className="text-xs">{t("orders.settings.to")}</span>
                    <Badge variant="default" className="bg-amber-600">
                      {calculateDeliveryExample(false).max}{" "}
                      {t("orders.settings.days")}
                    </Badge>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    +1 day penalty
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
