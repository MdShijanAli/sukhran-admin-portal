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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function PackageSettings() {
  const { t } = useTranslation();
  const store = usePackageSettingsStore();
  const { settings, scheduleOptions, isLoading } = store;

  // Local state for settings
  const [customPackageMinAmount, setCustomPackageMinAmount] =
    useState<string>("");
  const [customPackageEnabled, setCustomPackageEnabled] =
    useState<boolean>(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<ScheduleOption | null>(
    null
  );
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    option_type: "schedule_months" as
      | "schedule_months"
      | "frequency_per_month"
      | "delivery_time",
    value: "",
    label: "",
    display_order: 1,
    isActive: true,
    isDefault: false,
  });

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

  const handleAddOption = async () => {
    try {
      if (!formData.label || !formData.value) {
        toast.error(t("packageSettings.messages.fillAllFields"));
        return;
      }

      await packageSettingsService.setupSchedule([formData]);
      toast.success(t("packageSettings.messages.optionAdded"));
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add option:", error);
      toast.error(t("packageSettings.messages.failedToAdd"));
    }
  };

  const handleEditOption = async () => {
    try {
      if (!editingOption || !formData.label) {
        toast.error(t("packageSettings.messages.fillAllFields"));
        return;
      }

      await packageSettingsService.modifySchedule([
        {
          id: editingOption.id!,
          ...formData,
        },
      ]);
      toast.success(t("packageSettings.messages.optionUpdated"));
      setShowEditDialog(false);
      setEditingOption(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update option:", error);
      toast.error(t("packageSettings.messages.failedToUpdate"));
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
    try {
      const result = await packageSettingsService.enablePackageSettings(
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

  const resetForm = () => {
    setFormData({
      option_type: "schedule_months",
      value: "",
      label: "",
      display_order: 1,
      isActive: true,
      isDefault: false,
    });
  };

  const openEditDialog = (option: ScheduleOption) => {
    setEditingOption(option);
    setFormData({
      option_type: option.option_type,
      value: option.value,
      label: option.label,
      display_order: option.display_order,
      isActive: option.isActive,
      isDefault: option.isDefault,
    });
    setShowEditDialog(true);
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
            <Button
              size="sm"
              onClick={() => {
                setFormData({
                  ...formData,
                  option_type: options[0]?.option_type || "schedule_months",
                });
                setShowAddDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("packageSettings.addOption")}
            </Button>
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
                    <Switch
                      checked={option.isActive}
                      onCheckedChange={() => handleToggleOption(option)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditDialog(option)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteOptions([option.id!])}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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

              <Button
                onClick={handleSaveGeneralSettings}
                disabled={isSavingSettings}
              >
                <Save className="h-4 w-4 mr-2" />
                {t("packageSettings.saveSettings")}
              </Button>
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkToggle(true)}
                >
                  {t("packageSettings.activateSelected")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkToggle(false)}
                >
                  {t("packageSettings.deactivateSelected")}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteOptions(selectedOptions)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t("packageSettings.deleteSelected")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Options */}
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

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("packageSettings.addOption")}</DialogTitle>
            <DialogDescription>
              {t("packageSettings.addOptionDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("packageSettings.optionType")}</Label>
              <Select
                value={formData.option_type}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, option_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule_months">
                    {t("packageSettings.scheduleMonths")}
                  </SelectItem>
                  <SelectItem value="frequency_per_month">
                    {t("packageSettings.frequencyPerMonth")}
                  </SelectItem>
                  <SelectItem value="delivery_time">
                    {t("packageSettings.deliveryTime")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("packageSettings.label")}</Label>
              <Input
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder={t("packageSettings.enterLabel")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("packageSettings.value")}</Label>
              <Input
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                placeholder={t("packageSettings.enterValue")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("packageSettings.displayOrder")}</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t("packageSettings.isActive")}</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t("packageSettings.isDefault")}</Label>
              <Switch
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isDefault: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              {t("packageSettings.cancel")}
            </Button>
            <Button onClick={handleAddOption}>
              {t("packageSettings.add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("packageSettings.editOption")}</DialogTitle>
            <DialogDescription>
              {t("packageSettings.editOptionDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("packageSettings.label")}</Label>
              <Input
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder={t("packageSettings.enterLabel")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("packageSettings.value")}</Label>
              <Input
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                placeholder={t("packageSettings.enterValue")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("packageSettings.displayOrder")}</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t("packageSettings.isActive")}</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t("packageSettings.isDefault")}</Label>
              <Switch
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isDefault: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditingOption(null);
              }}
            >
              {t("packageSettings.cancel")}
            </Button>
            <Button onClick={handleEditOption}>
              {t("packageSettings.update")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
