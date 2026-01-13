import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Brand, BrandFormData } from "@/lib/types";
import brandService from "@/services/brandService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { BaseModal } from "@/components/modals";

interface BrandDialogProps {
  open: boolean;
  onClose: () => void;
  editData?: Brand;
}

export default function FormModal({
  open,
  onClose,
  editData,
}: BrandDialogProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<BrandFormData>({
    title: "",
    description: "",
    image: undefined,
    is_active: true,
    display_order: 1,
  });

  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setFormData({
        title: editData.title,
        description: editData.description,
        image: undefined,
        is_active: editData.is_active,
        display_order: editData.display_order,
      });
      setImagePreview(editData.image_url || "");
    } else {
      setIsEditing(false);
      setFormData({
        title: "",
        description: "",
        image: undefined,
        is_active: true,
        display_order: 1,
      });
      setImagePreview("");
    }
  }, [editData, open]);

  const updateField = (
    field: keyof BrandFormData,
    value: string | number | boolean | File
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("brands.messages.imageTooLarge"));
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(t("brands.messages.invalidImageType"));
        return;
      }

      updateField("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    updateField("image", undefined as unknown as File);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || formData.title.trim().length < 2) {
      toast.error(t("brands.messages.titleTooShort"));
      return;
    }

    if (!formData.description || formData.description.trim().length < 10) {
      toast.error(t("brands.messages.descriptionTooShort"));
      return;
    }

    if (!isEditing && !formData.image) {
      toast.error(t("brands.messages.imageRequired"));
      return;
    }

    if (formData.display_order < 1) {
      toast.error(t("brands.messages.invalidDisplayOrder"));
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("is_active", formData.is_active ? "1" : "0");
      submitData.append("display_order", formData.display_order.toString());

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      console.log("Submitting data:", Object.fromEntries(submitData));

      const result = isEditing
        ? await brandService.updateItem(editData!.id, submitData)
        : await brandService.storeItem(submitData);

      console.log("Result:", result);
      toast.success(
        isEditing
          ? t("brands.messages.brandUpdated")
          : t("brands.messages.brandCreated")
      );
      onClose();
    } catch (error) {
      console.error("Error submitting brand:", error);
      toast.error(
        isEditing
          ? t("brands.messages.failedToUpdate")
          : t("brands.messages.failedToCreate")
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
        isEditing ? t("brands.form.editBrand") : t("brands.form.createNewBrand")
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        isEditing ? t("brands.form.updateBrand") : t("brands.form.createBrand")
      }
      size="2xl"
    >
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="required">
            {t("brands.form.title")}
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder={t("brands.form.titlePlaceholder")}
            maxLength={100}
          />
          <p className="text-sm text-muted-foreground">
            {t("brands.form.titleHelp")}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="required">
            {t("brands.form.description")}
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder={t("brands.form.descriptionPlaceholder")}
            rows={4}
            maxLength={500}
          />
          <p className="text-sm text-muted-foreground">
            {formData.description.length}/500 {t("brands.form.characters")}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image" className={!isEditing ? "required" : ""}>
            {t("brands.form.image")}
          </Label>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {t("brands.form.uploadImage")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("brands.form.imageHelp")}
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    {t("brands.form.chooseFile")}
                  </Button>
                </div>
              </div>
            )}
            <Input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">{t("brands.form.displayOrder")}</Label>
          <Input
            id="display_order"
            type="number"
            min="1"
            value={formData.display_order}
            onChange={(e) =>
              updateField("display_order", parseInt(e.target.value) || 1)
            }
            placeholder={t("brands.form.displayOrderPlaceholder")}
          />
          <p className="text-sm text-muted-foreground">
            {t("brands.form.displayOrderHelp")}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="is_active">{t("brands.form.status")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("brands.form.statusHelp")}
            </p>
          </div>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => updateField("is_active", checked)}
          />
        </div>
      </div>
    </BaseModal>
  );
}
