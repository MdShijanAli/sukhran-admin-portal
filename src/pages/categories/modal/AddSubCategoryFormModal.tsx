import { useEffect, useState } from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X } from "lucide-react";
import categoryService from "@/services/categoryService";
import { Category } from "@/stores/categoryStore";

interface SubCategoryFormData {
  categoryId: string | number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  imgUrl?: File;
}

interface SubCategory {
  id: number;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  imgUrl: string;
  displayOrder: number;
  isActive: boolean;
  businessId: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

interface AddSubCategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  selectedCategory: Category | null;
  editData?: SubCategory | null;
}

export default function AddSubCategoryFormModal({
  open,
  onClose,
  selectedCategory,
  editData,
}: AddSubCategoryFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<SubCategoryFormData>({
    categoryId: "",
    name: "",
    description: "",
    displayOrder: 1,
    isActive: true,
  });
  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (open) {
      if (editData) {
        // Edit mode
        setFormData({
          categoryId: editData.categoryId,
          name: editData.name,
          description: editData.description,
          displayOrder: editData.displayOrder,
          isActive: editData.isActive,
        });
        if (editData.image_url || editData.imgUrl) {
          setImagePreview(
            editData.image_url || `${apiURL}/storage/${editData.imgUrl}`
          );
        } else {
          setImagePreview("");
        }
      } else {
        // Create mode
        setFormData({
          categoryId: selectedCategory?.id || "",
          name: "",
          description: "",
          displayOrder: 1,
          isActive: true,
        });
        setImagePreview("");
      }
    }
  }, [open, selectedCategory, editData]);

  const updateField = (
    field: keyof SubCategoryFormData,
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
    const fileInput = document.getElementById(
      "subCategoryImg"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.name) {
      toast.error("Please enter sub-category name");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("categoryId", formData.categoryId.toString());
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("displayOrder", formData.displayOrder.toString());
      formDataToSubmit.append("isActive", formData.isActive ? "1" : "0");

      if (formData.imgUrl) {
        formDataToSubmit.append("imgUrl", formData.imgUrl);
      }

      if (editData) {
        await categoryService.updateSubCategory(editData.id, formDataToSubmit);
        toast.success("Sub-category updated successfully");
      } else {
        await categoryService.storeSubCategory(formDataToSubmit);
        toast.success("Sub-category created successfully");
      }

      onClose();
    } catch (error) {
      console.error("Error submitting sub-category:", error);
      toast.error(
        editData
          ? "Failed to update sub-category"
          : "Failed to create sub-category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={editData ? "Edit Sub-Category" : "Add Sub-Category"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        editData ? "Update Sub-Category" : "Create Sub-Category"
      }
      size="2xl"
    >
      <div className="grid gap-6">
        {/* Category Name (Read-only) */}
        <div className="space-y-2">
          <Label>Parent Category</Label>
          <Input
            value={selectedCategory?.name || ""}
            disabled
            className="bg-muted"
          />
        </div>

        {/* Sub-Category Image */}
        <div className="space-y-2">
          <Label htmlFor="subCategoryImg">Sub-Category Image</Label>
          <Input
            id="subCategoryImg"
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

        {/* Sub-Category Name */}
        <div className="space-y-2">
          <Label htmlFor="subCategoryName">Sub-Category Name *</Label>
          <Input
            id="subCategoryName"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Enter sub-category name"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="subCategoryDescription">Description</Label>
          <Textarea
            id="subCategoryDescription"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Enter sub-category description"
            rows={3}
          />
        </div>

        {/* Display Order & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subCategoryDisplayOrder">Display Order</Label>
            <Input
              id="subCategoryDisplayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                updateField("displayOrder", parseInt(e.target.value) || 1)
              }
            />
          </div>
          <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="subCategoryIsActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => updateField("isActive", checked)}
            />
            <Label htmlFor="subCategoryIsActive">Active</Label>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
