import { useState } from "react";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";
import {
  BaseTableList,
  Column,
  DropdownMenuActions,
  ActionItem,
} from "@/components/table";
import { useCategoryStore, Category } from "@/stores/categoryStore";
import categoryService from "@/services/categoryService";
import { DeleteModal } from "@/components/modals";
import { toast } from "sonner";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setIsDeleting(true);
    try {
      const response = await categoryService.deleteItem(selectedCategory.id);
      console.log("Delete response:", response);
      if (response && response.status === 200) {
        toast.success("Category deleted successfully");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
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
    },
  ];

  // Define table columns
  const columns: Column<Category>[] = [
    {
      key: "sl",
      label: "Sl.",
      render: (_, index) => index + 1,
      className: "text-center",
    },
    {
      key: "image_url",
      label: "Image",
      render: (category) => (
        <img
          src={category.image_url || "/placeholder-image.png"}
          alt={category.name}
          className="size-16 rounded-md object-cover object-top"
        />
      ),
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "description",
      label: "Description",
      className: "max-w-[300px]",
    },
    {
      key: "sub_categories_count",
      label: "Sub Categories",
      className: "text-center w-[140px]",
    },
    {
      key: "products_count",
      label: "Products",
      className: "text-center",
    },
    {
      key: "status",
      label: "Status",
      render: (category) => (
        <Badge variant={category.isActive ? "default" : "secondary"}>
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
      className: "text-center",
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

      <ViewModal
        open={showDetails}
        onClose={setShowDetails}
        category={selectedCategory}
      />

      <DeleteModal
        open={showDelete}
        onClose={setShowDelete}
        title="Delete Category"
        description={`Are you sure you want to delete this ${selectedCategory?.name} category? This action cannot be undone.`}
        onConfirm={handleDeleteCategory}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Categories;
