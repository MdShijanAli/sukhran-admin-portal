import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banner } from "@/lib/types";
import { toast } from "sonner";
import bannerService from "@/services/bannerService";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannerFormData {
  title: string;
  link_type: "none" | "product" | "package" | "url";
  url: string;
  package_id: string;
  product_id: string;
  display_order: number;
  is_active: boolean;
  image: File | null;
}

interface BannerDialogProps {
  open: boolean;
  onClose: () => void;
  editData?: Banner;
}

export default function FormModal({
  open,
  onClose,
  editData,
}: BannerDialogProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<BannerFormData>({
    title: "",
    link_type: "none",
    url: "",
    package_id: "",
    product_id: "",
    display_order: 1,
    is_active: true,
    image: null,
  });

  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setFormData({
        title: editData.title,
        link_type: editData.link_type,
        url: editData.url || "",
        package_id: editData.package_id || "",
        product_id: editData.product_id || "",
        display_order: editData.display_order,
        is_active: editData.is_active,
        image: null,
      });
      setImagePreview(editData.image_url);
    } else {
      setIsEditing(false);
      setFormData({
        title: "",
        link_type: "none",
        url: "",
        package_id: "",
        product_id: "",
        display_order: 1,
        is_active: true,
        image: null,
      });
      setImagePreview(null);
    }
  }, [editData, open]);

  const updateField = <K extends keyof BannerFormData>(
    field: K,
    value: BannerFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error(t("banners.messages.invalidImageType"));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("banners.messages.imageTooLarge"));
      return;
    }

    updateField("image", file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    updateField("image", null);
    setImagePreview(editData?.image_url || null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || formData.title.length < 3) {
      toast.error(t("banners.messages.titleTooShort"));
      return;
    }

    if (!isEditing && !formData.image) {
      toast.error(t("banners.messages.imageRequired"));
      return;
    }

    if (formData.link_type === "url" && !formData.url) {
      toast.error(t("banners.messages.urlRequired"));
      return;
    }

    if (formData.link_type === "url" && formData.url) {
      try {
        new URL(formData.url);
      } catch {
        toast.error(t("banners.messages.invalidUrl"));
        return;
      }
    }

    if (formData.link_type === "package" && !formData.package_id) {
      toast.error(t("banners.messages.packageRequired"));
      return;
    }

    if (formData.link_type === "product" && !formData.product_id) {
      toast.error(t("banners.messages.productRequired"));
      return;
    }

    if (formData.display_order < 1) {
      toast.error(t("banners.messages.invalidDisplayOrder"));
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("link_type", formData.link_type);
      submitData.append("display_order", formData.display_order.toString());
      submitData.append("is_active", formData.is_active ? "1" : "0");

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      if (formData.link_type === "url" && formData.url) {
        submitData.append("url", formData.url);
      }

      if (formData.link_type === "package" && formData.package_id) {
        submitData.append("package_id", formData.package_id);
      }

      if (formData.link_type === "product" && formData.product_id) {
        submitData.append("product_id", formData.product_id);
      }

      console.log("Submitting data:", {
        title: formData.title,
        link_type: formData.link_type,
        display_order: formData.display_order,
        is_active: formData.is_active,
        hasImage: !!formData.image,
      });

      const result = isEditing
        ? await bannerService.updateItem(editData!.id, submitData)
        : await bannerService.storeItem(submitData);

      console.log("Result:", result);
      toast.success(
        isEditing
          ? t("banners.messages.bannerUpdated")
          : t("banners.messages.bannerCreated")
      );
      onClose();
    } catch (error) {
      console.error("Error submitting banner:", error);
      toast.error(
        isEditing
          ? t("banners.messages.failedToUpdate")
          : t("banners.messages.failedToCreate")
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
          ? t("banners.form.editBanner")
          : t("banners.form.createNewBanner")
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        isEditing
          ? t("banners.form.updateBanner")
          : t("banners.form.createBanner")
      }
      size="3xl"
    >
      <div className="grid gap-6">
        {/* Banner Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            {t("banners.form.title")}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder={t("banners.form.titlePlaceholder")}
          />
          <p className="text-xs text-muted-foreground">
            {t("banners.form.titleHint")}
          </p>
        </div>

        {/* Banner Image */}
        <div className="space-y-2">
          <Label>
            {t("banners.form.image")}{" "}
            {!isEditing && <span className="text-destructive">*</span>}
          </Label>

          {imagePreview ? (
            <div className="space-y-3">
              <div className="relative w-full max-w-2xl rounded-lg overflow-hidden border bg-muted">
                <img
                  src={imagePreview}
                  alt="Banner preview"
                  className="w-full h-auto object-cover"
                />
                {formData.image && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {!formData.image && isEditing && (
                <div>
                  <Label
                    htmlFor="image-change"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm"
                  >
                    <Upload className="h-4 w-4" />
                    {t("banners.form.changeImage")}
                  </Label>
                  <Input
                    id="image-change"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <Label
                htmlFor="image"
                className="cursor-pointer flex items-center justify-center gap-2 w-full h-40 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("banners.form.imagePlaceholder")}
                </span>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {t("banners.form.imageHint")}
          </p>
        </div>

        {/* Link Type and Display Order Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Link Type */}
          <div className="space-y-2">
            <Label htmlFor="link_type">
              {t("banners.form.linkType")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.link_type}
              onValueChange={(value) =>
                updateField("link_type", value as BannerFormData["link_type"])
              }
            >
              <SelectTrigger id="link_type">
                <SelectValue
                  placeholder={t("banners.form.linkTypePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {t("banners.linkTypes.none")}
                </SelectItem>
                <SelectItem value="url">
                  {t("banners.linkTypes.url")}
                </SelectItem>
                <SelectItem value="package">
                  {t("banners.linkTypes.package")}
                </SelectItem>
                <SelectItem value="product">
                  {t("banners.linkTypes.product")}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t("banners.form.linkTypeHint")}
            </p>
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <Label htmlFor="display_order">
              {t("banners.form.displayOrder")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="display_order"
              type="number"
              min="1"
              value={formData.display_order}
              onChange={(e) =>
                updateField("display_order", parseInt(e.target.value) || 1)
              }
              placeholder={t("banners.form.displayOrderPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {t("banners.form.displayOrderHint")}
            </p>
          </div>
        </div>

        {/* Conditional Link Fields */}
        {formData.link_type === "url" && (
          <div className="space-y-2">
            <Label htmlFor="url">
              {t("banners.form.url")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => updateField("url", e.target.value)}
              placeholder={t("banners.form.urlPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {t("banners.form.urlHint")}
            </p>
          </div>
        )}

        {formData.link_type === "package" && (
          <div className="space-y-2">
            <Label htmlFor="package_id">
              {t("banners.form.package")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="package_id"
              type="text"
              value={formData.package_id}
              onChange={(e) => updateField("package_id", e.target.value)}
              placeholder={t("banners.form.packagePlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {t("banners.form.packageHint")}
            </p>
          </div>
        )}

        {formData.link_type === "product" && (
          <div className="space-y-2">
            <Label htmlFor="product_id">
              {t("banners.form.product")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="product_id"
              type="text"
              value={formData.product_id}
              onChange={(e) => updateField("product_id", e.target.value)}
              placeholder={t("banners.form.productPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {t("banners.form.productHint")}
            </p>
          </div>
        )}

        {/* Active Status */}
        <div className="flex items-center space-x-2 rounded-lg border p-4">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => updateField("is_active", checked)}
          />
          <div>
            <Label htmlFor="is_active" className="text-base">
              {t("banners.form.activeStatus")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("banners.form.activeStatusHint")}
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
