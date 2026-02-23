import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { DonationChannel } from "@/lib/types";
import donationChannelService from "@/services/donationChannelService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ChannelFormData {
  name: string;
  description: string;
  targetAmount: string;
  display_order: string;
  isActive: boolean;
  imgUrl: File | null;
}

interface ChannelFormModalProps {
  open: boolean;
  onClose: () => void;
  editData?: DonationChannel;
  onSuccess?: () => void;
}

export default function ChannelFormModal({
  open,
  onClose,
  editData,
  onSuccess,
}: ChannelFormModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<ChannelFormData>({
    name: "",
    description: "",
    targetAmount: "",
    display_order: "1",
    isActive: true,
    imgUrl: null,
  });

  useEffect(() => {
    if (open) {
      if (editData) {
        setIsEditing(true);
        setFormData({
          name: editData.name,
          description: editData.description,
          targetAmount: editData.targetAmount.toString(),
          display_order: editData.displayOrder.toString(),
          isActive: editData.isActive,
          imgUrl: null,
        });
        setImagePreview(editData.image_url);
      } else {
        setIsEditing(false);
        setFormData({
          name: "",
          description: "",
          targetAmount: "",
          display_order: "1",
          isActive: true,
          imgUrl: null,
        });
        setImagePreview("");
      }
    }
  }, [open, editData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imgUrl: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imgUrl: null });
    setImagePreview("");
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.targetAmount ||
      !formData.display_order
    ) {
      toast.error(t("donations.channels.messages.failedToCreate"));
      return;
    }

    // Validate image for new channels
    if (!isEditing && !formData.imgUrl) {
      toast.error(t("donations.channels.form.selectImage"));
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("targetAmount", formData.targetAmount);
      submitData.append("display_order", formData.display_order);
      submitData.append("isActive", formData.isActive ? "1" : "0");

      if (formData.imgUrl) {
        submitData.append("imgUrl", formData.imgUrl);
      }

      if (isEditing && editData) {
        await donationChannelService.updateItem(editData.id, submitData);
        toast.success(t("donations.channels.messages.updated"));
      } else {
        await donationChannelService.storeItem(submitData);
        toast.success(t("donations.channels.messages.created"));
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving channel:", error);
      toast.error(
        isEditing
          ? t("donations.channels.messages.failedToUpdate")
          : t("donations.channels.messages.failedToCreate")
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
          ? t("donations.channels.form.edit")
          : t("donations.channels.form.create")
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t(isEditing ? "update" : "create")}
      size="lg"
    >
      <div className="space-y-4">
        {/* Channel Image */}
        <div>
          <Label>{t("donations.channels.form.image")} *</Label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative w-full h-48 border-2 border-dashed rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="">
                      {t("donations.channels.form.selectImage")}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Channel Name */}
        <div>
          <Label htmlFor="name">{t("donations.channels.form.name")} *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t("donations.channels.form.namePlaceholder")}
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">
            {t("donations.channels.form.description")} *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder={t("donations.channels.form.descriptionPlaceholder")}
            rows={4}
          />
        </div>

        {/* Target Amount and Display Order */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetAmount">
              {t("donations.channels.form.targetAmount")} *
            </Label>
            <Input
              id="targetAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) =>
                setFormData({ ...formData, targetAmount: e.target.value })
              }
              placeholder={t("donations.channels.form.targetAmountPlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="display_order">
              {t("donations.channels.form.displayOrder")} *
            </Label>
            <Input
              id="display_order"
              type="number"
              min="1"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({ ...formData, display_order: e.target.value })
              }
              placeholder={t("donations.channels.form.displayOrderPlaceholder")}
            />
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center justify-between">
          <Label htmlFor="isActive">
            {t("donations.channels.form.isActive")}
          </Label>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
          />
        </div>
      </div>
    </BaseModal>
  );
}
