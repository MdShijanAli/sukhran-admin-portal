import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Settings2,
  Save,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  RotateCcw,
} from "lucide-react";
import { usePackageSettingsStore } from "@/stores/packageSettingsStore";
import packageSettingsService from "@/services/packageSettingsService";
import { ScheduleOption } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import ScheduleOptionFormModal from "./modal/ScheduleOptionFormModal";
import { withPermission } from "@/hoc/withPermission";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";

function PackageSettings() {
  const { t } = useTranslation();
  const { settings, scheduleOptions, isLoading } = usePackageSettingsStore();
  const { hasPermission } = usePermissions();

  // Local state for settings
  const [customPackageMinAmount, setCustomPackageMinAmount] =
    useState<string>("");
  const [customPackageEnabled, setCustomPackageEnabled] =
    useState<boolean>(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Dialog states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingOption, setEditingOption] = useState<ScheduleOption | null>(
    null
  );
  const [defaultOptionType, setDefaultOptionType] = useState<
    "schedule_months" | "frequency_per_month" | "delivery_time"
  >("schedule_months");
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Update local state when settings change
  useEffect(() => {
    const minAmountSetting = settings.find(
      (s) => s.key === "custom_package_min_amount"
    );
    const enabledSetting = settings.find(
      (s) => s.key === "custom_package_enabled"
    );

    if (minAmountSetting) {
      setCustomPackageMinAmount(minAmountSetting.value);
    }
    if (enabledSetting) {
      setCustomPackageEnabled(enabledSetting.value === "true");
    }
  }, [settings]);

  const fetchData = async () => {
    try {
      await Promise.all([
        packageSettingsService.fetchSettings(),
        packageSettingsService.fetchScheduleOptions(),
      ]);
    } catch (error) {
      console.error("Failed to fetch package settings:", error);
      toast.error(t("packageSettings.messages.failedToLoad"));
    }
  };

  const handleSaveGeneralSettings = async () => {
    try {
      setIsSavingSettings(true);

      const minAmountSetting = settings.find(
        (s) => s.key === "custom_package_min_amount"
      );
      const enabledSetting = settings.find(
        (s) => s.key === "custom_package_enabled"
      );

      const promises = [];

      if (
        minAmountSetting &&
        minAmountSetting.value !== customPackageMinAmount
      ) {
        promises.push(
          packageSettingsService.updateSetting(
            minAmountSetting.id,
            customPackageMinAmount
          )
        );
      }

      if (
        enabledSetting &&
        enabledSetting.value !== customPackageEnabled.toString()
      ) {
        promises.push(
          packageSettingsService.updateSetting(
            enabledSetting.id,
            customPackageEnabled.toString()
          )
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        toast.success(t("packageSettings.messages.settingsUpdated"));
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error(t("packageSettings.messages.failedToSave"));
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDeleteOptions = async (ids: number[]) => {
    try {
      if (ids.length === 0) return;
      await packageSettingsService.deleteScheduleOptions(ids);
      toast.success(t("packageSettings.messages.optionsDeleted"));
      setSelectedOptions([]);
    } catch (error) {
      console.error("Failed to delete options:", error);
      toast.error(t("packageSettings.messages.failedToDelete"));
    }
  };

  const handleBulkToggle = async (isActive: boolean) => {
    try {
      if (selectedOptions.length === 0) return;
      await packageSettingsService.bulkToggleSchedule(
        selectedOptions,
        isActive
      );
      toast.success(t("packageSettings.messages.statusUpdated"));
      setSelectedOptions([]);
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error(t("packageSettings.messages.failedToToggle"));
    }
  };

  const handleEnabledChange = async (checked: boolean) => {
    console.log("settings", settings);
    // return;
    try {
      const result = await packageSettingsService.enablePackageSettings(
        settings[1].id,
        checked
      );
      toast.success(t("packageSettings.messages.statusUpdated"));
    } catch (error) {
      console.error("Failed to toggle enabled status:", error);
      toast.error(t("packageSettings.messages.failedToToggle"));
    }
  };

  const handleToggleOption = async (option: ScheduleOption) => {
    try {
      await packageSettingsService.modifySchedule([
        {
          id: option.id!,
          isActive: !option.isActive,
        },
      ]);
      toast.success(t("packageSettings.messages.statusUpdated"));
    } catch (error) {
      console.error("Failed to toggle option:", error);
      toast.error(t("packageSettings.messages.failedToToggle"));
    }
  };

  const handleFormSuccess = () => {
    fetchData();
    setEditingOption(null);
  };

  const openAddDialog = (
    optionType: "schedule_months" | "frequency_per_month" | "delivery_time"
  ) => {
    setDefaultOptionType(optionType);
    setEditingOption(null);
    setShowFormModal(true);
  };

  const openEditDialog = (option: ScheduleOption) => {
    setEditingOption(option);
    setShowFormModal(true);
  };

  const renderScheduleSection = (
    title: string,
    options: ScheduleOption[],
    icon: React.ReactNode
  ) => {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle>{title}</CardTitle>
            </div>
            {hasPermission(permissions.package_schedule_options.create) && (
              <Button
                size="sm"
                onClick={() => {
                  openAddDialog(options[0]?.option_type || "schedule_months");
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t("packageSettings.addOption")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : options.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("packageSettings.noOptions")}
            </div>
          ) : (
            <div className="space-y-2">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option.id!)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOptions([...selectedOptions, option.id!]);
                        } else {
                          setSelectedOptions(
                            selectedOptions.filter((id) => id !== option.id)
                          );
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.label}</span>
                        {option.isDefault && (
                          <Badge variant="secondary">
                            {t("packageSettings.default")}
                          </Badge>
                        )}
                        {!option.isActive && (
                          <Badge variant="destructive">
                            {t("packageSettings.inactive")}
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {t("packageSettings.value")}: {option.value} |{" "}
                        {t("packageSettings.order")}: {option.display_order}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasPermission(
                      permissions.package_schedule_options.edit
                    ) && (
                      <Switch
                        checked={option.isActive}
                        onCheckedChange={() => handleToggleOption(option)}
                      />
                    )}

                    {hasPermission(
                      permissions.package_schedule_options.edit
                    ) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(option)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    {hasPermission(
                      permissions.package_schedule_options.delete
                    ) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteOptions([option.id!])}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("packageSettings.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("packageSettings.subtitle")}
          </p>
        </div>
        <Button onClick={fetchData} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          {t("packageSettings.refresh")}
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            <CardTitle>{t("packageSettings.generalSettings")}</CardTitle>
          </div>
          <CardDescription>
            {t("packageSettings.generalSettingsDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <>
              {customPackageEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="minAmount">
                    {t("packageSettings.customPackageMinAmount")}
                  </Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={customPackageMinAmount}
                    onChange={(e) => setCustomPackageMinAmount(e.target.value)}
                    placeholder={t("packageSettings.enterMinAmount")}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t("packageSettings.minAmountDesc")}
                  </p>
                </div>
              )}

              {hasPermission(permissions.settings.edit) && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enabled">
                      {t("packageSettings.customPackageEnabled")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("packageSettings.enabledDesc")}
                    </p>
                  </div>
                  <Switch
                    id="enabled"
                    checked={customPackageEnabled}
                    onCheckedChange={handleEnabledChange}
                  />
                </div>
              )}

              {customPackageEnabled &&
                hasPermission(permissions.settings.edit) && (
                  <Button
                    onClick={handleSaveGeneralSettings}
                    disabled={isSavingSettings}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t("packageSettings.saveSettings")}
                  </Button>
                )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedOptions.length > 0 && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedOptions.length} {t("packageSettings.optionsSelected")}
              </span>
              <div className="flex gap-2">
                {hasPermission(permissions.package_schedule_options.edit) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkToggle(true)}
                  >
                    {t("packageSettings.activateSelected")}
                  </Button>
                )}

                {hasPermission(permissions.package_schedule_options.edit) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkToggle(false)}
                  >
                    {t("packageSettings.deactivateSelected")}
                  </Button>
                )}

                {hasPermission(permissions.package_schedule_options.delete) && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteOptions(selectedOptions)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t("packageSettings.deleteSelected")}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Options */}
      {hasPermission(permissions.package_schedule_options.view) && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            {t("packageSettings.scheduleOptions")}
          </h2>

          {scheduleOptions && (
            <>
              {renderScheduleSection(
                t("packageSettings.scheduleMonths"),
                scheduleOptions.schedule_months,
                <Calendar className="h-5 w-5" />
              )}
              {renderScheduleSection(
                t("packageSettings.frequencyPerMonth"),
                scheduleOptions.frequency_per_month,
                <RotateCcw className="h-5 w-5" />
              )}
              {renderScheduleSection(
                t("packageSettings.deliveryTime"),
                scheduleOptions.delivery_time,
                <Clock className="h-5 w-5" />
              )}
            </>
          )}
        </div>
      )}

      {/* Form Modal */}
      <ScheduleOptionFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingOption(null);
        }}
        editData={editingOption}
        onSuccess={handleFormSuccess}
        defaultOptionType={defaultOptionType}
      />
    </div>
  );
}

export default withPermission(PackageSettings, permissions.settings.view);
