import { useEffect, useState } from "react";
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

export function CoverageAreaDialog({
  open,
  onClose,
  editData,
}: CoverageAreaDialogProps) {
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
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (!formData.city || formData.city.length < 2) {
      toast.error("City must be at least 2 characters");
      return;
    }
    if (formData.latitude < -90 || formData.latitude > 90) {
      toast.error("Latitude must be between -90 and 90");
      return;
    }
    if (formData.longitude < -180 || formData.longitude > 180) {
      toast.error("Longitude must be between -180 and 180");
      return;
    }
    if (formData.radius_km < 0.1 || formData.radius_km > 100) {
      toast.error("Radius must be between 0.1 and 100 km");
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
          ? "Coverage area updated successfully"
          : "Coverage area created successfully"
      );
      onClose();
    } catch (error) {
      console.error("Error submitting coverage area:", error);
      toast.error(
        isEditing
          ? "Failed to update coverage area"
          : "Failed to create coverage area"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={isEditing ? "Edit Coverage Area" : "Create New Coverage Area"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={isEditing ? "Update Area" : "Create Area"}
      size="2xl"
    >
      <div className="grid gap-6">
        {/* Area Name and City */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Area Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g., Gulshan"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="e.g., Dhaka"
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              value={formData.latitude}
              onChange={(e) =>
                updateField("latitude", parseFloat(e.target.value) || 0)
              }
              placeholder="e.g., 23.7808"
            />
            <p className="text-xs text-muted-foreground">Between -90 and 90</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              value={formData.longitude}
              onChange={(e) =>
                updateField("longitude", parseFloat(e.target.value) || 0)
              }
              placeholder="e.g., 90.4156"
            />
            <p className="text-xs text-muted-foreground">
              Between -180 and 180
            </p>
          </div>
        </div>

        {/* Radius */}
        <div className="space-y-2">
          <Label htmlFor="radius_km">Radius (km)</Label>
          <Input
            id="radius_km"
            type="number"
            step="0.1"
            value={formData.radius_km}
            onChange={(e) =>
              updateField("radius_km", parseFloat(e.target.value) || 0)
            }
            placeholder="e.g., 5"
          />
          <p className="text-xs text-muted-foreground">
            Service coverage radius in kilometers
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
              Active Status
            </Label>
            <p className="text-sm text-muted-foreground">
              Enable or disable this coverage area
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
