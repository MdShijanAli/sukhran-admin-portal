import { useState } from "react";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FormModal from "./modal/FormModal";
import { CategoryDetailsDialog } from "./modal/CategoryDetailsDialog";
import { DeleteCategoryDialog } from "./modal/DeleteCategoryDialog";
import {
  BaseTableList,
  Column,
  DropdownMenuActions,
  ActionItem,
} from "@/components/table";
import { useCategoryStore, Category } from "@/stores/categoryStore";
import categoryService from "@/services/categoryService";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const store = useCategoryStore();

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

  // Define actions for dropdown menu
  const categoryActions: ActionItem<Category>[] = [
    {
      label: "View Details",
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: "Edit Category",
      icon: Edit,
      onClick: handleEdit,
      separator: true,
    },
    {
      label: "Delete Category",
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      show: (category) => category.isActive, // Example: only show for active categories
    },
  ];

  // Define table columns
  const columns: Column<Category>[] = [
    {
      key: "sl",
      label: "Sl.",
    },
    {
      key: "image",
      label: "Image",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "description",
      label: "Description",
      className: "max-w-[200px]",
    },
    {
      key: "totalOrders",
      label: "Orders",
    },
    {
      key: "subCategories",
      label: "Sub Categories",
    },
    {
      key: "products",
      label: "Products",
    },
    {
      key: "status",
      label: "Status",
      render: (category) => (
        <Badge variant={category.isActive ? "default" : "secondary"}>
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (category) => (
        <DropdownMenuActions item={category} actions={categoryActions} />
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Category>
        title="Categories"
        description="Manage your product categories"
        headerActions={[
          {
            label: "Add Category",
            icon: Plus,
            onClick: handleCreate,
            variant: "default",
          },
        ]}
        searchPlaceholder="Search by name or description..."
        enableSearch={true}
        columns={columns}
        service={categoryService}
        store={store}
        emptyMessage="No categories found"
        getRowKey={(category) => category.id}
      />

      {/* Dialogs */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        editData={selectedCategory}
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
