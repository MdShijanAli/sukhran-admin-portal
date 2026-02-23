import { BaseModal } from "@/components/modals/BaseModal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Package, Layers, Edit, Trash2 } from "lucide-react";
import { Category } from "@/stores/categoryStore";
import { useEffect, useState } from "react";
import categoryService from "@/services/categoryService";
import SubCategoryFormModal from "./SubCategoryFormModal";
import { DeleteModal } from "@/components/modals";
import { toast } from "sonner";
import TimeStaps from "@/components/custom/TimeStamps";
import usePermissions from "@/hooks/use-permissions";
import permissions from "@/lib/permissions";

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

interface CategoryDetails extends Category {
  sub_categories?: SubCategory[];
}

interface ApiResponse {
  data: CategoryDetails;
}

interface ViewModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  categoryId: string | number | null;
}

export default function ViewModal({
  open,
  onClose,
  categoryId,
}: ViewModalProps) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [showEditSubCategory, setShowEditSubCategory] = useState(false);
  const [showDeleteSubCategory, setShowDeleteSubCategory] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!categoryId) return;
    const fetchCategory = async () => {
      setIsCategoryLoading(true);
      try {
        const response = await categoryService.fetchDetails(categoryId);
        console.log("Fetched category details:", response);
        // API returns { data: CategoryDetails }
        const apiResponse = response as unknown as ApiResponse;
        setCategory(apiResponse.data || (response as CategoryDetails));
      } catch (error) {
        console.error("Failed to fetch category details:", error);
      } finally {
        setIsCategoryLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleEditSubCategory = (subCat: SubCategory) => {
    setSelectedSubCategory(subCat);
    setShowEditSubCategory(true);
  };

  const handleDeleteSubCategory = (subCat: SubCategory) => {
    setSelectedSubCategory(subCat);
    setShowDeleteSubCategory(true);
  };

  const confirmDeleteSubCategory = async () => {
    if (!selectedSubCategory) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteSubCategory(selectedSubCategory.id);
      toast.success(t("categories.messages.subCategoryDeleted"));
      // Refresh category details
      if (categoryId) {
        const response = await categoryService.fetchDetails(categoryId);
        await categoryService.fetchLists(); // Refresh categories list
        const apiResponse = response as unknown as ApiResponse;
        setCategory(apiResponse.data || (response as CategoryDetails));
      }
      setShowDeleteSubCategory(false);
    } catch (error) {
      console.error("Error deleting sub-category:", error);
      toast.error(t("categories.messages.failedToDeleteSubCategory"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseEditModal = async () => {
    setShowEditSubCategory(false);
    // Refresh category details after edit
    if (categoryId) {
      setIsCategoryLoading(true);
      try {
        const response = await categoryService.fetchDetails(categoryId);
        const apiResponse = response as unknown as ApiResponse;
        setCategory(apiResponse.data || (response as CategoryDetails));
      } catch (error) {
        console.error("Failed to refresh category details:", error);
      } finally {
        setIsCategoryLoading(false);
      }
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={() => onClose(false)}
      title={t("categories.view.categoryDetails")}
      size="2xl"
      showSubmitButton={false}
      loading={isCategoryLoading}
      closeButtonText={t("close")}
    >
      <div className="space-y-6">
        {/* Image & Basic Info */}
        <div className="flex gap-6">
          {category?.image_url && (
            <img
              src={category.image_url}
              alt={category?.name}
              className="h-32 w-32 rounded-lg object-cover object-top"
            />
          )}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-2xl ">{category?.name}</h3>
              {category?.slug && (
                <p className="text-sm text-muted-foreground">
                  {t("categories.view.slug")}: {category?.slug}
                </p>
              )}
            </div>
            <Badge variant={category?.isActive ? "default" : "secondary"}>
              {category?.isActive
                ? t("categories.view.active")
                : t("categories.view.inactive")}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Description */}
        {category?.description && (
          <>
            <div>
              <h4 className="mb-2 ">
                {t("categories.view.description")}
              </h4>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            <Separator />
          </>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Layers className="h-4 w-4" />
              <span className="text-sm">
                {t("categories.view.subCategories")}
              </span>
            </div>
            <p className="text-2xl ">{category?.sub_categories?.length || 0}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="h-4 w-4" />
              <span className="text-sm">{t("categories.view.products")}</span>
            </div>
            <p className="text-2xl ">{category?.products_count || 0}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="text-sm">
                {t("categories.view.displayOrder")}
              </span>
            </div>
            <p className="text-2xl ">{category?.displayOrder || "-"}</p>
          </div>
        </div>

        <Separator />

        {/* Sub Categories List */}
        {category?.sub_categories && category.sub_categories.length > 0 && (
          <>
            <div>
              <h4 className="mb-3  flex items-center gap-2">
                <Layers className="h-4 w-4" />
                {t("categories.view.subCategories")} (
                {category.sub_categories.length})
              </h4>
              <div className="space-y-3">
                {category.sub_categories.map((subCat) => (
                  <div
                    key={subCat.id}
                    className="rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex gap-4">
                      {subCat.imgUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={
                              subCat.image_url ||
                              `https://d2c.thevisitlondon.com/storage/${subCat.imgUrl}`
                            }
                            alt={subCat.name}
                            className="h-16 w-16 rounded-md object-cover object-top"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h5 className="">{subCat.name}</h5>
                            <p className="text-xs text-muted-foreground">
                              {subCat.slug}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                subCat.isActive ? "default" : "secondary"
                              }
                              className="flex-shrink-0"
                            >
                              {subCat.isActive
                                ? t("categories.view.active")
                                : t("categories.view.inactive")}
                            </Badge>
                            {hasPermission(permissions.categories.edit) && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleEditSubCategory(subCat)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}

                            {hasPermission(permissions.categories.delete) && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteSubCategory(subCat)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        {subCat.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {subCat.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>
                            {t("categories.view.displayOrder")}:{" "}
                            {subCat.displayOrder}
                          </span>
                          <span>•</span>
                          <span>
                            {t("categories.view.created")}:{" "}
                            {new Date(subCat.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {category?.sub_categories && category.sub_categories.length === 0 && (
          <>
            <div className="text-center py-6 text-muted-foreground">
              <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {t("categories.view.noSubCategoriesFound")}
              </p>
            </div>
            <Separator />
          </>
        )}

        {/* Timestamps */}
        <TimeStaps item={category} />
      </div>

      {/* Edit Sub-Category Modal */}
      <SubCategoryFormModal
        open={showEditSubCategory}
        onClose={handleCloseEditModal}
        selectedCategory={category}
        editData={selectedSubCategory}
      />

      {/* Delete Sub-Category Modal */}
      <DeleteModal
        open={showDeleteSubCategory}
        onClose={() => setShowDeleteSubCategory(false)}
        title={t("categories.delete.subCategoryTitle")}
        description={`${t("deleteConfirm")} "${selectedSubCategory?.name}"? ${t(
          "deleteAftermath",
        )}`}
        onConfirm={confirmDeleteSubCategory}
        isDeleting={isDeleting}
      />
    </BaseModal>
  );
}
