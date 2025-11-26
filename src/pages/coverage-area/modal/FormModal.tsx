import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CoverageArea } from "@/lib/types";
import { toast } from "sonner";
import coverageAreaService from "@/services/coverageAreaService";

interface CoverageAreaFormData {
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  is_active: boolean;
}

interface CoverageAreaDialogProps {
  open: boolean;
  onClose: () => void;
  editData?: CoverageArea;
}

export default function FormModal({
  open,
  onClose,
  editData,
}: CoverageAreaDialogProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CoverageAreaFormData>({
    name: "",
    city: "",
    latitude: 0,
    longitude: 0,
    radius_km: 5,
    is_active: true,
  });

  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setFormData({
        name: editData.name,
        city: editData.city,
        latitude: parseFloat(editData.latitude),
        longitude: parseFloat(editData.longitude),
        radius_km: parseFloat(editData.radius_km),
        is_active: editData.is_active,
      });
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        city: "",
        latitude: 0,
        longitude: 0,
        radius_km: 5,
        is_active: true,
      });
    }
  }, [editData, open]);

  const updateField = (
    field: keyof CoverageAreaFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || formData.name.length < 2) {
      toast.error(t("coverage_area.messages.nameTooShort"));
      return;
    }
    if (!formData.city || formData.city.length < 2) {
      toast.error(t("coverage_area.messages.cityTooShort"));
      return;
    }
    if (formData.latitude < -90 || formData.latitude > 90) {
      toast.error(t("coverage_area.messages.invalidLatitude"));
      return;
    }
    if (formData.longitude < -180 || formData.longitude > 180) {
      toast.error(t("coverage_area.messages.invalidLongitude"));
      return;
    }
    if (formData.radius_km < 0.1 || formData.radius_km > 100) {
      toast.error(t("coverage_area.messages.invalidRadius"));
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        name: formData.name,
        city: formData.city,
        latitude: formData.latitude,
        longitude: formData.longitude,
        radius_km: formData.radius_km,
        is_active: formData.is_active,
      };

      console.log("Submitting data:", dataToSubmit);

      const result = isEditing
        ? await coverageAreaService.updateCoverageArea(
            editData!.id,
            dataToSubmit
          )
        : await coverageAreaService.storeItem(dataToSubmit);

      console.log("Result:", result);
      toast.success(
        isEditing
          ? t("coverage_area.messages.areaUpdated")
          : t("coverage_area.messages.areaCreated")
      );
      onClose();
    } catch (error) {
      console.error("Error submitting coverage area:", error);
      toast.error(
        isEditing
          ? t("coverage_area.messages.failedToUpdate")
          : t("coverage_area.messages.failedToCreate")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={
        isEditing
          ? t("coverage_area.form.editCoverageArea")
          : t("coverage_area.form.createNewCoverageArea")
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        isEditing
          ? t("coverage_area.form.updateArea")
          : t("coverage_area.form.createArea")
      }
      size="2xl"
    >
      <div className="grid gap-6">
        {/* Area Name and City */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("coverage_area.form.areaName")} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("coverage_area.form.areaNamePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">{t("coverage_area.form.city")} *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder={t("coverage_area.form.cityPlaceholder")}
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">{t("coverage_area.form.latitude")}</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              value={formData.latitude}
              onChange={(e) =>
                updateField("latitude", parseFloat(e.target.value) || 0)
              }
              placeholder={t("coverage_area.form.latitudePlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {t("coverage_area.form.latitudeHint")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">
              {t("coverage_area.form.longitude")}
            </Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              value={formData.longitude}
              onChange={(e) =>
                updateField("longitude", parseFloat(e.target.value) || 0)
              }
              placeholder={t("coverage_area.form.longitudePlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {t("coverage_area.form.longitudeHint")}
            </p>
          </div>
        </div>

        {/* Radius */}
        <div className="space-y-2">
          <Label htmlFor="radius_km">{t("coverage_area.form.radiusKm")}</Label>
          <Input
            id="radius_km"
            type="number"
            step="0.1"
            value={formData.radius_km}
            onChange={(e) =>
              updateField("radius_km", parseFloat(e.target.value) || 0)
            }
            placeholder={t("coverage_area.form.radiusPlaceholder")}
          />
          <p className="text-xs text-muted-foreground">
            {t("coverage_area.form.radiusHint")}
          </p>
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2 rounded-lg border p-4">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => updateField("is_active", checked)}
          />
          <div>
            <Label htmlFor="is_active" className="text-base">
              {t("coverage_area.form.activeStatus")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("coverage_area.form.activeStatusHint")}
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
