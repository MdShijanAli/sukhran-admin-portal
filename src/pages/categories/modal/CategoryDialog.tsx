import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Category, CategoryFormData, SubCategory } from "@/lib/types";
import { SortableSubCategory } from "../SortableSubCategory";
import { toast } from "sonner";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  mode: "create" | "edit";
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  mode,
}: CategoryDialogProps) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<CategoryFormData>({
      defaultValues: {
        name: "",
        description: "",
        displayOrder: 1,
        isActive: true,
        subCategories: [],
      },
    });

  useEffect(() => {
    if (category && mode === "edit") {
      reset({
        name: category.name,
        description: category.description,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
        subCategories: category.subCategories || [],
      });
      setSubCategories(category.subCategories || []);
      setImagePreview(category.image_url);
    } else {
      reset({
        name: "",
        description: "",
        displayOrder: 1,
        isActive: true,
        subCategories: [],
      });
      setSubCategories([]);
      setImagePreview("");
    }
  }, [category, mode, reset, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSubCategory = () => {
    setSubCategories([
      ...subCategories,
      {
        name: "",
        description: "",
        displayOrder: subCategories.length + 1,
        isActive: true,
      },
    ]);
  };

  const removeSubCategory = (index: number) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  };

  const updateSubCategory = (
    index: number,
    field: keyof SubCategory,
    value: any
  ) => {
    const updated = [...subCategories];
    updated[index] = { ...updated[index], [field]: value };
    setSubCategories(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = parseInt(active.id.toString().split("-")[1]);
      const overIndex = parseInt(over.id.toString().split("-")[1]);

      const reordered = arrayMove(subCategories, activeIndex, overIndex).map(
        (subCat, index) => ({
          ...subCat,
          displayOrder: index + 1,
        })
      );

      setSubCategories(reordered);
      toast.success("Sub-categories reordered");
    }
  };

  const onSubmit = (data: CategoryFormData) => {
    const payload = { ...data, subCategories };
    console.log("Submitting:", payload);
    toast.success(
      mode === "create"
        ? "Category created successfully"
        : "Category updated successfully"
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new category with optional sub-categories"
              : "Update category details and manage sub-categories"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-32 w-32 rounded-md object-cover"
              />
            )}
          </div>

          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input id="name" {...register("name", { required: true })} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>

          {/* Display Order & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                {...register("displayOrder", { valueAsNumber: true })}
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="isActive"
                checked={watch("isActive")}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <Separator />

          {/* Sub Categories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Sub Categories</h3>
                <p className="text-sm text-muted-foreground">
                  Add sub-categories to organize products better
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubCategory}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Sub Category
              </Button>
            </div>

            {subCategories.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={subCategories.map((_, index) => `sub-${index}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {subCategories.map((subCat, index) => (
                      <SortableSubCategory
                        key={`sub-${index}`}
                        subCategory={subCat}
                        index={index}
                        onUpdate={(field, value) =>
                          updateSubCategory(index, field, value)
                        }
                        onRemove={() => removeSubCategory(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Category" : "Update Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
