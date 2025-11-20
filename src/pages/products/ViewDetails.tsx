import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Package,
  Tag,
  Calendar,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import productService from "@/services/productService";
import { toast } from "sonner";
import noProductImage from "@/assets/images/no_product_image.png";

interface ProductDetails {
  id: number;
  categoryId: string;
  subCategoryId: string;
  name: string;
  slug: string;
  productType: string;
  description: string;
  imgUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  businessId: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    imgUrl: string;
    image_url?: string;
  };
  sub_category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    imgUrl: string;
    image_url?: string;
  };
  skus: Array<{
    id: number;
    name: string;
    imgUrl: string | null;
    image_url: string | null;
    unit: {
      name: string;
      size: string;
    };
    pricing: {
      currentPrice: number;
      originalPrice: number;
      discountPercent: number;
    };
    stockQuantity: number;
    isInStock: boolean;
    metaData: {
      weight: string;
      color: string;
      length: string;
      width: string;
      height: string;
    };
  }>;
  photos: any[];
}

const ProductViewDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await productService.fetchDetails(id);
        const data = (response as { data?: ProductDetails })?.data || response;
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Product not found</h3>
            <p className="text-muted-foreground mt-2">
              The product you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => navigate("/products")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/products")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.slug}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/products/edit/${product.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Left Column - Product Image & Status */}
        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.image_url || noProductImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Featured</span>
                <Badge variant={product.isFeatured ? "destructive" : "outline"}>
                  {product.isFeatured ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="outline" className="capitalize">
                  {product.productType}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Category</p>
                <div className="flex items-center gap-3">
                  {product.category.image_url && (
                    <img
                      src={product.category.image_url}
                      alt={product.category.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{product.category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.category.description}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Sub-Category
                </p>
                <div className="flex items-center gap-3">
                  {product.sub_category.image_url && (
                    <img
                      src={product.sub_category.image_url}
                      alt={product.sub_category.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{product.sub_category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sub_category.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm">
                  {new Date(product.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm">
                  {new Date(product.updated_at).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Product Details & SKUs */}
        <div className="space-y-3 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-sm">
                  {product.description || "No description available"}
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Product ID
                  </p>
                  <p className="text-sm font-mono">{product.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Business ID
                  </p>
                  <p className="text-sm font-mono">{product.businessId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SKUs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Product Variants (SKUs)
                </CardTitle>
                <Badge variant="secondary">
                  {product.skus.length} Variant
                  {product.skus.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.skus.map((sku, index) => (
                <Card key={sku.id} className="border-2">
                  <CardContent className="p-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* SKU Image */}
                      {sku.image_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={sku.image_url}
                            alt={sku.name}
                            className="h-24 w-24 rounded-lg object-cover"
                          />
                        </div>
                      )}

                      {/* SKU Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-base">
                              {sku.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              SKU ID: {sku.id}
                            </p>
                          </div>
                          <Badge
                            variant={sku.isInStock ? "default" : "destructive"}
                          >
                            {sku.isInStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Current Price
                            </p>
                            <p className="text-2xl font-bold text-primary">
                              ৳{sku.pricing.currentPrice}
                            </p>
                          </div>
                          {sku.pricing.originalPrice !==
                            sku.pricing.currentPrice && (
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Original Price
                              </p>
                              <p className="text-lg line-through text-muted-foreground">
                                ৳{sku.pricing.originalPrice}
                              </p>
                            </div>
                          )}
                          {sku.pricing.discountPercent > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {sku.pricing.discountPercent}% OFF
                            </Badge>
                          )}
                        </div>

                        {/* Unit & Stock */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">
                              Unit
                            </p>
                            <p className="font-medium">
                              {sku.unit.size} {sku.unit.name}
                            </p>
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                              <ShoppingCart className="h-3 w-3" />
                              Stock
                            </p>
                            <p className="font-medium">{sku.stockQuantity}</p>
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">
                              Weight
                            </p>
                            <p className="font-medium">
                              {sku.metaData.weight} kg
                            </p>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="border-t pt-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Dimensions & Details
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Color:
                              </span>{" "}
                              <span className="font-medium">
                                {sku.metaData.color}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Length:
                              </span>{" "}
                              <span className="font-medium">
                                {sku.metaData.length} cm
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Width:
                              </span>{" "}
                              <span className="font-medium">
                                {sku.metaData.width} cm
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Height:
                              </span>{" "}
                              <span className="font-medium">
                                {sku.metaData.height} cm
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductViewDetails;
