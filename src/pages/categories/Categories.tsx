import { useState, useCallback } from "react";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import FormModal from "./modal/FormModal";
import ViewModal from "./modal/ViewModal";
import SubCategoryFormModal from "./modal/SubCategoryFormModal";
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
import permissions from "@/lib/permissions";
import { withPermission } from "@/hoc/withPermission";
import usePermissions from "@/hooks/use-permissions";

const Categories = () => {
  const { t } = useTranslation();
  const store = useCategoryStore();
  const { hasPermission } = usePermissions();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAddSubCategory, setShowAddSubCategory] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

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
      await categoryService.deleteItem(selectedCategory.id);
      toast.success(t("categories.messages.categoryDeleted"));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(t("categories.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  // Define actions for dropdown menu
  const categoryActions: ActionItem<Category>[] = [
    {
      label: t("categories.actions.viewDetails"),
      icon: Eye,
      onClick: handleViewDetails,
    },
    {
      label: t("categories.actions.editCategory"),
      icon: Edit,
      onClick: handleEdit,
      show: hasPermission(permissions.categories.edit),
    },
    {
      label: t("categories.actions.deleteCategory"),
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
      show: hasPermission(permissions.categories.delete),
    },
    {
      label: t("categories.actions.addSubCategory"),
      icon: Plus,
      onClick: (category) => {
        setSelectedCategory(category);
        setShowAddSubCategory(true);
      },
      show: hasPermission(permissions.categories.create),
    },
  ];

  // Define table columns
  const columns: Column<Category>[] = [
    {
      key: "sl",
      label: t("categories.columns.sl"),
      render: (_, index) => index + 1,
      className: "text-center",
    },
    {
      key: "image_url",
      label: t("categories.columns.image"),
      render: (category) => (
        <img
          src={category.image_url || "/placeholder-image.png"}
          alt={category.name}
          className="w-16 h-16 rounded-md object-cover object-top"
        />
      ),
    },
    {
      key: "name",
      label: t("categories.columns.name"),
    },
    {
      key: "description",
      label: t("categories.columns.description"),
      className: "max-w-[300px]",
    },
    {
      key: "sub_categories_count",
      label: t("categories.columns.subCategories"),
      className: "text-center w-[140px]",
    },
    {
      key: "products_count",
      label: t("categories.columns.products"),
      className: "text-center",
    },
    {
      key: "status",
      label: t("categories.columns.status"),
      render: (category) => (
        <Badge variant={category.isActive ? "default" : "secondary"}>
          {category.isActive
            ? t("categories.columns.active")
            : t("categories.columns.inactive")}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "actions",
      label: t("categories.columns.actions"),
      className: "text-right",
      render: (category) => (
        <DropdownMenuActions
          item={category}
          actions={categoryActions}
          menuLabel={t("categories.columns.actions")}
        />
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <BaseTableList<Category>
        title={t("categories.title")}
        description={t("categories.subtitle")}
        headerActions={
          hasPermission(permissions.categories.create) && [
            {
              label: t("categories.addCategory"),
              icon: Plus,
              onClick: handleCreate,
              variant: "default",
            },
          ]
        }
        searchPlaceholder={t("categories.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={categoryService}
        store={store}
        emptyMessage={t("categories.noCategoriesFound")}
        getRowKey={(category) => category.id}
        onRefresh={handleSetRefresh}
      />

      {/* Dialogs */}
      <FormModal
        open={dialogMode !== null}
        onClose={() => setDialogMode(null)}
        editData={selectedCategory || undefined}
      />

      <SubCategoryFormModal
        open={showAddSubCategory}
        onClose={() => setShowAddSubCategory(false)}
        selectedCategory={selectedCategory}
      />

      <ViewModal
        open={showDetails}
        onClose={setShowDetails}
        categoryId={selectedCategory?.id || null}
      />

      <DeleteModal
        open={showDelete}
        onClose={setShowDelete}
        title={t("categories.delete.categoryTitle")}
        description={`${t("deleteConfirm")} ${selectedCategory?.name} ${t(
          "categories.delete.categoryTitle"
        ).toLowerCase()}? ${t("deleteAftermath")}`}
        onConfirm={handleDeleteCategory}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default withPermission(Categories, permissions.categories.view);
