import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Package, Layers } from "lucide-react";
import { Category } from "@/lib/types";

interface CategoryDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function CategoryDetailsDialog({
  open,
  onOpenChange,
  category,
}: CategoryDetailsDialogProps) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
          <DialogDescription>
            Complete information about this category
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image & Basic Info */}
          <div className="flex gap-6">
            <img
              src={category.image_url}
              alt={category.name}
              className="h-32 w-32 rounded-lg object-cover"
            />
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-2xl font-bold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Slug: {category.slug}
                </p>
              </div>
              <Badge variant={category.isActive ? "default" : "secondary"}>
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className="mb-2 font-semibold">Description</h4>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Layers className="h-4 w-4" />
                <span className="text-sm">Sub Categories</span>
              </div>
              <p className="text-2xl font-bold">
                {category.sub_categories_count}
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="h-4 w-4" />
                <span className="text-sm">Products</span>
              </div>
              <p className="text-2xl font-bold">{category.products_count}</p>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <span className="text-sm">Display Order</span>
              </div>
              <p className="text-2xl font-bold">{category.displayOrder}</p>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Created: {new Date(category.created_at).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Updated: {new Date(category.updated_at).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Business ID: {category.businessId}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
