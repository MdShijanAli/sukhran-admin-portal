import { BaseModal } from "@/components/modals/BaseModal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Package, Layers, Image as ImageIcon } from "lucide-react";
import { Category } from "@/stores/categoryStore";
import { useEffect, useState } from "react";
import categoryService from "@/services/categoryService";

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
  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;
    const fetchCategory = async () => {
      setIsCategoryLoading(true);
      try {
        const response = await categoryService.fetchDetails(categoryId);
        console.log("Fetched category details:", response);
        setCategory(response.data);
      } catch (error) {
        console.error("Failed to fetch category details:", error);
      } finally {
        setIsCategoryLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return (
    <BaseModal
      open={open}
      onOpenChange={() => onClose(false)}
      title="Category Details"
      size="2xl"
      showSubmitButton={false}
      loading={isCategoryLoading}
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
              <h3 className="text-2xl font-bold">{category?.name}</h3>
              {category?.slug && (
                <p className="text-sm text-muted-foreground">
                  Slug: {category?.slug}
                </p>
              )}
            </div>
            <Badge variant={category?.isActive ? "default" : "secondary"}>
              {category?.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Description */}
        {category?.description && (
          <>
            <div>
              <h4 className="mb-2 font-semibold">Description</h4>
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
              <span className="text-sm">Sub Categories</span>
            </div>
            <p className="text-2xl font-bold">
              {category?.sub_categories?.length || 0}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="h-4 w-4" />
              <span className="text-sm">Products</span>
            </div>
            <p className="text-2xl font-bold">
              {category?.products_count || 0}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="text-sm">Display Order</span>
            </div>
            <p className="text-2xl font-bold">
              {category?.displayOrder || "-"}
            </p>
          </div>
        </div>

        <Separator />

        {/* Sub Categories List */}
        {category?.sub_categories && category.sub_categories.length > 0 && (
          <>
            <div>
              <h4 className="mb-3 font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Sub Categories ({category.sub_categories.length})
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
                            <h5 className="font-semibold">{subCat.name}</h5>
                            <p className="text-xs text-muted-foreground">
                              {subCat.slug}
                            </p>
                          </div>
                          <Badge
                            variant={subCat.isActive ? "default" : "secondary"}
                            className="flex-shrink-0"
                          >
                            {subCat.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {subCat.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {subCat.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Display Order: {subCat.displayOrder}</span>
                          <span>•</span>
                          <span>
                            Created:{" "}
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
              <p className="text-sm">No sub-categories found</p>
            </div>
            <Separator />
          </>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-sm">
          {category?.created_at && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Created: {new Date(category?.created_at).toLocaleString()}
              </span>
            </div>
          )}
          {category?.updated_at && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Updated: {new Date(category?.updated_at).toLocaleString()}
              </span>
            </div>
          )}
          {category?.businessId && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Business ID: {category?.businessId}</span>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
