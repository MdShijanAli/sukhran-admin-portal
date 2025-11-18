import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubCategory } from "@/lib/types";

interface SortableSubCategoryProps {
  subCategory: SubCategory;
  index: number;
  onUpdate: (field: keyof SubCategory, value: any) => void;
  onRemove: () => void;
}

export function SortableSubCategory({
  subCategory,
  index,
  onUpdate,
  onRemove,
}: SortableSubCategoryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `sub-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border bg-muted/50 p-4 space-y-4 transition-all ${
        isDragging ? "opacity-50 shadow-lg scale-105" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <button
            className="cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
          <span className="font-medium">Sub Category {index + 1}</span>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input
            value={subCategory.name}
            onChange={(e) => onUpdate("name", e.target.value)}
            placeholder="Enter sub-category name"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={subCategory.description}
            onChange={(e) => onUpdate("description", e.target.value)}
            placeholder="Enter description"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={subCategory.displayOrder}
              onChange={(e) =>
                onUpdate("displayOrder", parseInt(e.target.value))
              }
            />
          </div>
          <div className="flex items-center space-x-2 pt-8">
            <Switch
              checked={subCategory.isActive}
              onCheckedChange={(checked) => onUpdate("isActive", checked)}
            />
            <Label>Active</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
