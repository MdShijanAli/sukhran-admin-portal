import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useReferralStore } from "@/stores/referralStore";
import referralService from "@/services/referralService";
import { useStatsController } from "@/hooks/use-api-controller";
import {
  CheckCircle,
  Save,
  Info,
  Coins,
  DollarSign,
  FileText,
} from "lucide-react";
import { ReferralSettings } from "@/lib/types";
import { toast } from "sonner";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

interface SettingsTabProps {
  onSuccess?: () => void;
}

const SettingsTab = ({ onSuccess }: SettingsTabProps) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const store = useReferralStore.getState();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ReferralSettings>>({
    isEnabled: false,
    coinsPerReferral: 0,
    minOrderAmount: 0,
    description: "",
  });

  const { data, isLoading } = useStatsController({
    serviceFn: () => referralService.getSettings(),
    store,
    dataKey: "settings",
    setterKey: "setSettings",
    autoFetch: true,
    cacheEnabled: true,
    onError: (error) => {
      toast.error(t("referrals.settings.messages.failedToUpdate"));
    },
  });

  const settings = data?.data as ReferralSettings;

  useEffect(() => {
    if (settings) {
      setFormData({
        isEnabled: settings.isEnabled,
        coinsPerReferral: settings.coinsPerReferral,
        minOrderAmount: settings.minOrderAmount,
        description: settings.description,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await referralService.updateSettings(formData);
      toast.success(t("referrals.settings.messages.updated"));
      onSuccess?.();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(t("referrals.settings.messages.failedToUpdate"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    field: keyof ReferralSettings,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg  mb-2">
            {t("referrals.settings.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("referrals.settings.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enable/Disable Program */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <Label htmlFor="isEnabled" className="text-base font-medium">
                {t("referrals.settings.form.isEnabled")}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t("referrals.settings.form.isEnabledDescription")}
              </p>
            </div>
            {hasPermission(permissions.referrals.update_settings) && (
              <Switch
                id="isEnabled"
                checked={formData.isEnabled}
                onCheckedChange={(checked) =>
                  handleChange("isEnabled", checked)
                }
              />
            )}
          </div>

          {/* Coins Per Referral */}
          <div className="space-y-2">
            <Label
              htmlFor="coinsPerReferral"
              className="flex items-center gap-2"
            >
              <Coins className="w-4 h-4 text-amber-600" />
              {t("referrals.settings.form.coinsPerReferral")}
            </Label>
            <Input
              id="coinsPerReferral"
              type="number"
              step="0.01"
              min="0"
              placeholder={t(
                "referrals.settings.form.coinsPerReferralPlaceholder"
              )}
              value={formData.coinsPerReferral}
              onChange={(e) =>
                handleChange(
                  "coinsPerReferral",
                  parseFloat(e.target.value) || 0
                )
              }
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              {t("referrals.settings.form.coinsPerReferralDescription")}
            </p>
          </div>

          {/* Minimum Order Amount */}
          <div className="space-y-2">
            <Label htmlFor="minOrderAmount" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              {t("referrals.settings.form.minOrderAmount")}
            </Label>
            <Input
              id="minOrderAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder={t(
                "referrals.settings.form.minOrderAmountPlaceholder"
              )}
              value={formData.minOrderAmount}
              onChange={(e) =>
                handleChange("minOrderAmount", parseFloat(e.target.value) || 0)
              }
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              {t("referrals.settings.form.minOrderAmountDescription")}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              {t("referrals.settings.form.description")}
            </Label>
            <Textarea
              id="description"
              placeholder={t("referrals.settings.form.descriptionPlaceholder")}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="max-w-2xl"
            />
            <p className="text-xs text-muted-foreground">
              {t("referrals.settings.form.descriptionDescription")}
            </p>
          </div>

          {/* Submit Button */}
          {hasPermission(permissions.referrals.update_settings) && (
            <div className="flex gap-3">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    {t("referrals.settings.form.saving")}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t("referrals.settings.form.save")}
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* How It Works Info Card */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className=" text-blue-900 dark:text-blue-100 mb-3">
              {t("referrals.settings.info.title")}
            </h4>
            <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{t("referrals.settings.info.step1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{t("referrals.settings.info.step2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{t("referrals.settings.info.step3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{t("referrals.settings.info.step4")}</span>
              </li>
            </ol>
            <p className="mt-3 text-xs text-blue-700 dark:text-blue-300 font-medium">
              {t("referrals.settings.info.note")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsTab;
