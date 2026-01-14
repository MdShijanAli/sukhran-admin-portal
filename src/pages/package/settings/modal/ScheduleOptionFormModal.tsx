import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScheduleOption } from "@/lib/types";
import packageSettingsService from "@/services/packageSettingsService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ScheduleOptionFormData {
  option_type: "schedule_months" | "frequency_per_month" | "delivery_time";
  value: string;
  label: string;
  display_order: number;
  isActive: boolean;
  isDefault: boolean;
}

interface ScheduleOptionFormModalProps {
  open: boolean;
  onClose: () => void;
  editData?: ScheduleOption | null;
  onSuccess?: () => void;
  defaultOptionType?:
    | "schedule_months"
    | "frequency_per_month"
    | "delivery_time";
}

export default function ScheduleOptionFormModal({
  open,
  onClose,
  editData,
  onSuccess,
  defaultOptionType,
}: ScheduleOptionFormModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ScheduleOptionFormData>({
    option_type: defaultOptionType || "schedule_months",
    value: "",
    label: "",
    display_order: 1,
    isActive: true,
    isDefault: false,
  });

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.label || !formData.value) {
      toast.error(t("packageSettings.messages.fillAllFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editData) {
        await packageSettingsService.modifySchedule([
          {
            id: editData.id!,
            ...formData,
          },
        ]);
        toast.success(t("packageSettings.messages.optionUpdated"));
      } else {
        await packageSettingsService.setupSchedule([formData]);
        toast.success(t("packageSettings.messages.optionAdded"));
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        isEditing
          ? t("packageSettings.messages.failedToUpdate")
          : t("packageSettings.messages.failedToAdd")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setFormData({
        option_type: editData.option_type,
        value: editData.value,
        label: editData.label,
        display_order: editData.display_order,
        isActive: editData.isActive,
        isDefault: editData.isDefault,
      });
    } else {
      setIsEditing(false);
      setFormData({
        option_type: defaultOptionType || "schedule_months",
        value: "",
        label: "",
        display_order: 1,
        isActive: true,
        isDefault: false,
      });
    }
  }, [editData, open, defaultOptionType]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={
        isEditing
          ? t("packageSettings.editOption")
          : t("packageSettings.addOption")
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        isEditing ? t("packageSettings.update") : t("packageSettings.add")
      }
      size="lg"
      closeButtonText={t("packageSettings.cancel")}
      description={
        isEditing
          ? t("packageSettings.editOptionDesc")
          : t("packageSettings.addOptionDesc")
      }
    >
      <div className="space-y-4">
        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="option_type">
              {t("packageSettings.optionType")} *
            </Label>
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
        )}

        <div className="space-y-2">
          <Label htmlFor="label">{t("packageSettings.label")} *</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
            placeholder={t("packageSettings.enterLabel")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">{t("packageSettings.value")} *</Label>
          <Input
            id="value"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            placeholder={t("packageSettings.enterValue")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">
            {t("packageSettings.displayOrder")}
          </Label>
          <Input
            id="display_order"
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
          <Label htmlFor="isActive">{t("packageSettings.isActive")}</Label>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isDefault">{t("packageSettings.isDefault")}</Label>
          <Switch
            id="isDefault"
            checked={formData.isDefault}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isDefault: checked })
            }
          />
        </div>
      </div>
    </BaseModal>
  );
}
