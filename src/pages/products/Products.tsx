import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Eye,
  Search,
  RefreshCw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import productService from "@/services/productService";
import { useProductStore, Product } from "@/stores/productStore";
import { DeleteModal } from "@/components/modals";
import noProductImage from "@/assets/images/no_product_image.png";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Pagination } from "@/components/table/Pagination";
import ShareButton from "@/components/custom/ShareButton";
import { formatNumberWithCommas } from "@/lib/utils";
import { withPermission } from "@/hoc/withPermission";
import permissions from "@/lib/permissions";
import usePermissions from "@/hooks/use-permissions";

const Products = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const store = useProductStore();
  const { hasPermission } = usePermissions();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSkus, setSelectedSkus] = useState<
    Record<string | number, number>
  >({});
  const currentPage = store.pagination?.current_page || 1;
  const perPage = store.pagination?.per_page || 20;
  const { isCollapsed } = useSidebarStore();

  const handleSkuSelect = (productId: string | number, skuId: number) => {
    setSelectedSkus((prev) => ({
      ...prev,
      [productId]: skuId,
    }));
  };

  // Get data from store
  const products = store.products || [];
  const pagination = store.pagination;
  const isLoading = store.isLoading || false;
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const fetchProducts = useCallback(
    async (forceFetch = false) => {
      if (
        !forceFetch &&
        products.length > 0 &&
        !hasInitialFetch &&
        isFirstRender
      ) {
        console.log("Using cached data from store, skipping API call");
        setHasInitialFetch(true);
        return;
      }
      try {
        store.setLoading?.(true);
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append("search", searchQuery);
        }
        params.append("page", currentPage.toString());
        params.append("per_page", perPage.toString());
        await productService.fetchLists(params.toString());
        if (!hasInitialFetch) {
          setHasInitialFetch(true);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error(error.data.message || "Failed to load products");
      } finally {
        store.setLoading?.(false);
      }
    },
    [
      searchQuery,
      isFirstRender,
      hasInitialFetch,
      products.length,
      perPage,
      currentPage,
    ]
  );

  // Fetch on mount and when dependencies change
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      fetchProducts();
    }
  }, [fetchProducts, isFirstRender]);

  // Fetch products on mount and page change
  useEffect(() => {
    if (isFirstRender) return; // Skip debounce on first render

    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        store.setPagination?.({
          ...store.pagination,
          current_page: 1,
        });
      } else {
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(timer);
    // Only run when searchQuery changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Handle filter, page, and perPage changes
  useEffect(() => {
    if (isFirstRender) return; // Skip on first render
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts(true);
    setIsRefreshing(false);
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleView = (product: Product) => {
    navigate(`/products/view/${product.id}`);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      await productService.deleteItem(selectedProduct.id);
      toast.success("Product deleted successfully");
      await fetchProducts(currentPage);
      setShowDelete(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <Card className="mb-3">
        <CardContent className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("products.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("products.subtitle")}
            </p>
          </div>
          <div className="flex gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("products.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            {hasPermission(permissions.products.create) && (
              <Button
                className="gap-2"
                onClick={() => navigate("/products/create")}
              >
                <Plus className="h-4 w-4" />
                {t("products.addProduct")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div>
        {isLoading ? (
          <div
            className={`grid grid-cols-2 gap-3 ${
              isCollapsed
                ? "2xl:grid-cols-6 xl:grid-cols-5 sm:grid-cols-3 lg:grid-cols-4"
                : "2xl:grid-cols-5 xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-8 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                {t("products.noProductsFound")}
              </h3>
              <p className="text-muted-foreground mt-2">
                {t("products.getStarted")}
              </p>
              <Button
                className="mt-4 gap-2"
                onClick={() => navigate("/products/create")}
              >
                <Plus className="h-4 w-4" />
                {t("products.addProduct")}
              </Button>
            </div>
          </Card>
        ) : (
          <div
            className={`grid grid-cols-2 gap-3 ${
              isCollapsed
                ? "2xl:grid-cols-6 xl:grid-cols-5 sm:grid-cols-3 lg:grid-cols-4"
                : "2xl:grid-cols-5 xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {products.map((product) => {
              const firstSku = product.skus?.[0];
              const hasMultipleSKUs = (product.skus?.length || 0) > 1;
              const selectedSkuId = selectedSkus[product.id];
              const selectedSku = selectedSkuId
                ? product.skus?.find((sku) => sku.id === selectedSkuId)
                : firstSku;
              const displaySku = selectedSku || firstSku;

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden transition-all hover:shadow-lg"
                >
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={
                          displaySku?.image_url ||
                          product.image_url ||
                          noProductImage
                        }
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute right-1 top-1 flex gap-1">
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {product.isActive
                            ? t("products.columns.active")
                            : t("products.columns.inactive")}
                        </Badge>
                        {product.isFeatured && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {t("products.columns.featured")}
                          </Badge>
                        )}
                      </div>
                      {hasMultipleSKUs && (
                        <Badge
                          className="absolute left-1 top-1 text-[10px] px-1.5 py-0"
                          variant="secondary"
                        >
                          {product.skus?.length} {t("products.skus")}
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-2.5 space-y-2">
                      {/* Product Name */}
                      <h3 className="font-semibold text-sm line-clamp-2 min-h-[2rem]">
                        {product.name}
                      </h3>

                      {/* SKUs */}
                      {product.skus && product.skus.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px]">
                            {t("products.skus")}:
                          </span>
                          {product.skus.map((sku) => (
                            <Badge
                              key={sku.id}
                              variant={
                                displaySku?.id === sku.id
                                  ? "default"
                                  : "outline"
                              }
                              className="text-[10px] px-1.5 py-0.5 cursor-pointer hover:bg-primary/80 hover:text-white transition-colors"
                              onClick={() =>
                                handleSkuSelect(product.id, sku.id)
                              }
                            >
                              {sku.unit.size} {sku.unit.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Price */}
                      {displaySku && (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-base font-bold text-primary">
                              ৳
                              {formatNumberWithCommas(
                                (displaySku as any).pricing?.currentPrice || 0
                              )}
                              <span className="text-[10px] ml-1">
                                ({displaySku.stockQuantity} qty)
                              </span>
                            </p>
                            {(displaySku as any).pricing?.originalPrice &&
                              (displaySku as any).pricing.originalPrice !==
                                (displaySku as any).pricing.currentPrice && (
                                <p className="text-[10px] text-muted-foreground line-through">
                                  ৳
                                  {formatNumberWithCommas(
                                    (displaySku as any).pricing.originalPrice
                                  )}
                                </p>
                              )}
                          </div>
                          <Badge
                            variant={
                              (displaySku as any).isInStock
                                ? "default"
                                : "destructive"
                            }
                            className="text-[10px] px-1.5 py-0"
                          >
                            {(displaySku as any).isInStock
                              ? t("products.view.inStock")
                              : t("products.view.outOfStock")}
                          </Badge>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-1 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          onClick={() => handleView(product)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {/* <ShareButton
                          url={`${window.location.origin}/products/view/${product.id}`}
                          title={`Check out ${product.name}`}
                          description={
                            product.description || "Amazing product!"
                          }
                          price={displaySku?.pricing?.currentPrice}
                          variant="outline"
                          size="sm"
                          iconOnly
                          className="flex-1 h-8 text-xs"
                        /> */}
                        {hasPermission(permissions.products.edit) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        {hasPermission(permissions.products.delete) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading &&
        products.length > 0 &&
        pagination &&
        pagination.last_page > 1 && (
          <Card className="mt-3">
            <CardContent className="p-0">
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
                totalItems={pagination.total}
                itemsPerPage={pagination.per_page}
                store={store}
              />
            </CardContent>
          </Card>
        )}

      {/* Delete Product Modal */}
      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={t("products.delete.title")}
        description={`${t("deleteConfirm")} "${selectedProduct?.name}"? ${t(
          "deleteAftermath"
        )}`}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default withPermission(Products, permissions.products.view);
