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

const Products = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const store = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get data from store
  const products = store.products || [];
  const isLoading = store.isLoading || false;

  const fetchProducts = useCallback(async () => {
    try {
      store.setLoading?.(true);
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      await productService.fetchLists(params.toString());
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts();
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
      await fetchProducts();
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("nav.products")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/products/create")}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-8 bg-muted rounded" />
                  <div className="h-12 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground mt-2">
                Get started by creating a new product
              </p>
              <Button
                className="mt-4 gap-2"
                onClick={() => navigate("/products/create")}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const firstSku = product.skus?.[0];
              const hasMultipleSKUs = (product.skus?.length || 0) > 1;

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden transition-all hover:shadow-lg"
                >
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={
                          firstSku?.image_url ||
                          product.image_url ||
                          noProductImage
                        }
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute right-2 top-2 flex gap-2">
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {product.isFeatured && (
                          <Badge variant="destructive">Featured</Badge>
                        )}
                      </div>
                      {hasMultipleSKUs && (
                        <Badge
                          className="absolute left-2 top-2"
                          variant="secondary"
                        >
                          {product.skus?.length} SKUs
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {product.category?.name}
                          </p>
                          {product.subCategory && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">
                                {product.subCategory.name}
                              </p>
                            </>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs capitalize"
                        >
                          {product.productType}
                        </Badge>
                      </div>

                      {/* SKU Info */}
                      {firstSku && (
                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {firstSku.name}
                              </p>
                              <p className="text-sm font-medium">
                                {(firstSku as any).unit?.name}{" "}
                                {(firstSku as any).unit?.size}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">
                                ৳{(firstSku as any).pricing?.currentPrice || 0}
                              </p>
                              {(firstSku as any).pricing?.originalPrice &&
                                (firstSku as any).pricing.originalPrice !==
                                  (firstSku as any).pricing.currentPrice && (
                                  <p className="text-sm text-muted-foreground line-through">
                                    ৳{(firstSku as any).pricing.originalPrice}
                                  </p>
                                )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">
                              Stock: {firstSku.stockQuantity || 0}
                            </p>
                            <Badge
                              variant={
                                (firstSku as any).isInStock
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {(firstSku as any).isInStock
                                ? "In Stock"
                                : "Out of Stock"}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1"
                          onClick={() => handleView(product)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Product Modal */}
      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Product"
        description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Products;
