import { useEffect, useState } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Category } from "@/stores/categoryStore";
import { toast } from "sonner";
import categoryService from "@/services/categoryService";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryFormData {
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  imgUrl?: File;
}

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  editData?: Category;
}

export default function FormModal({
  open,
  onClose,
  editData,
}: CategoryDialogProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    displayOrder: 1,
    isActive: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setFormData({
        name: editData.name,
        description: editData.description || "",
        displayOrder: editData.displayOrder || 1,
        isActive: editData.isActive ?? true,
      });
      setImagePreview(editData.image_url || "");
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        description: "",
        displayOrder: 1,
        isActive: true,
      });
      setImagePreview("");
    }
  }, [editData, open]);

  const updateField = (
    field: keyof CategoryFormData,
    value: string | number | boolean | File
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("imgUrl", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, imgUrl: undefined }));
    // Reset file input
    const fileInput = document.getElementById("imgUrl") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("displayOrder", formData.displayOrder.toString());
      formDataToSubmit.append("isActive", formData.isActive ? "1" : "0");

      // Append image file if exists
      if (formData.imgUrl) {
        formDataToSubmit.append("imgUrl", formData.imgUrl);
      }

      console.log("Submitting FormData:", formDataToSubmit);

      const result = isEditing
        ? await categoryService.updateItem(editData!.id, formDataToSubmit)
        : await categoryService.storeItem(formDataToSubmit);

      console.log("Result:", result);
      toast.success(
        isEditing
          ? t("categories.messages.categoryUpdated")
          : t("categories.messages.categoryCreated")
      );
      onClose();
    } catch (error) {
      console.error("Error submitting category:", error);
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
          ? t("categories.form.editCategory")
          : t("categories.form.createCategory")
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        isEditing
          ? t("categories.form.updateCategory")
          : t("categories.form.createCategory")
      }
      size="2xl"
      closeButtonText={t("cancel")}
    >
      <div className="grid gap-6">
        {/* Category Image */}
        <div className="space-y-2">
          <Label htmlFor="imgUrl">{t("categories.form.categoryImage")}</Label>
          <Input
            id="imgUrl"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="relative inline-block mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 rounded-md object-cover object-top"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Category Name */}
        <div className="space-y-2">
          <Label htmlFor="name">{t("categories.form.categoryName")} *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder={t("categories.form.enterCategoryName")}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            {t("categories.form.description")}
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder={t("categories.form.enterDescription")}
            rows={3}
          />
        </div>

        {/* Display Order & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="displayOrder">
              {t("categories.form.displayOrder")}
            </Label>
            <Input
              id="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                updateField("displayOrder", parseInt(e.target.value) || 1)
              }
            />
          </div>
          <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => updateField("isActive", checked)}
            />
            <Label htmlFor="isActive">{t("categories.form.active")}</Label>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
