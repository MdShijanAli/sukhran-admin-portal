import { useState } from "react";
import { Plus, Search } from "lucide-react";
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
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CategoryDialog } from "./modal/CategoryDialog";
import { CategoryDetailsDialog } from "./modal/CategoryDetailsDialog";
import { DeleteCategoryDialog } from "./modal/DeleteCategoryDialog";
import { SortableCategoryRow } from "./SortableCategoryRow";
import { toast } from "sonner";
import { Category } from "@/lib/types";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Mock data - replace with actual API call
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Groceries",
      slug: "groceries",
      description: "Fresh groceries and daily essentials",
      imgUrl: "categories/xQsid87m6BUxpfO0vPZszn7OC3PtRWjbOJpBbQuM.jpg",
      displayOrder: 1,
      isActive: true,
      businessId: "1",
      created_at: "2025-11-18T06:19:49.000000Z",
      updated_at: "2025-11-18T06:19:49.000000Z",
      sub_categories_count: "0",
      products_count: "0",
      image_url:
        "https://d2c.thevisitlondon.com/storage/categories/xQsid87m6BUxpfO0vPZszn7OC3PtRWjbOJpBbQuM.jpg",
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex).map(
        (cat, index) => ({
          ...cat,
          displayOrder: index + 1,
        })
      );

      setCategories(newCategories);
      toast.success("Category order updated");
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setDialogMode("create");
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogMode("edit");
  };

  const handleViewDetails = (category: Category) => {
    setSelectedCategory(category);
    setShowDetails(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setShowDelete(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Manage your product categories
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Sub Categories</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredCategories.map((cat) => cat.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredCategories.map((category) => (
                    <SortableCategoryRow
                      key={category.id}
                      category={category}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialogs */}
      <CategoryDialog
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
        category={selectedCategory}
        mode={dialogMode || "create"}
      />

      <CategoryDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        category={selectedCategory}
      />

      <DeleteCategoryDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        category={selectedCategory}
      />
    </div>
  );
};

export default Categories;
