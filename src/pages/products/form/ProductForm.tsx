import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Backpack, Loader2, Plus, Trash2, Undo2, X } from "lucide-react";
import { toast } from "sonner";
import productService from "@/services/productService";
import categoryService from "@/services/categoryService";
import { ProductSku } from "@/stores/productStore";

interface Category {
  id: number | string;
  name: string;
  sub_categories?: SubCategory[];
}

interface SubCategory {
  id: number | string;
  name: string;
}

interface ProductFormData {
  categoryId: string;
  name: string;
  subCategoryId?: string;
  productType: "normal" | "subscription" | "bundle";
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  imgUrl?: File;
}

export default function ProductForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    categoryId: "",
    name: "",
    subCategoryId: "",
    productType: "normal",
    description: "",
    isActive: true,
    isFeatured: false,
  });

  const [skus, setSkus] = useState<ProductSku[]>([
    {
      name: "",
      unitName: "",
      unitSize: "",
      currentPrice: 0,
      stockQuantity: 0,
      originalPrice: 0,
      weight: 0,
      color: "",
      length: 0,
      width: 0,
      height: 0,
    },
  ]);

  const [skuImages, setSkuImages] = useState<{ [key: number]: string }>({});

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch product details if editing
  useEffect(() => {
    if (isEditMode && id) {
      fetchProductDetails(id);
    }
  }, [isEditMode, id]);

  const fetchSubCategories = async (categoryId: string) => {
    setIsLoadingSubCategories(true);
    try {
      const result = await categoryService.fetchSubCategories(categoryId);
      if (result?.data) {
        setSubCategories(result.data);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Failed to fetch sub-categories:", error);
      toast.error("Failed to load sub-categories");
    } finally {
      setIsLoadingSubCategories(false);
    }
  };

  // useEffect(() => {
  //   if (formData.categoryId) {
  //     fetchSubCategories(formData.categoryId);
  //   } else {
  //     setSubCategories([]);
  //   }
  // }, [formData.categoryId]);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await categoryService.fetchLists();
      const categoriesData =
        (response as { data?: Category[] })?.data || (response as Category[]);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchProductDetails = async (productId: string) => {
    setIsLoadingProduct(true);
    try {
      const response = await productService.fetchDetails(productId);
      const product = (response as { data?: any })?.data || (response as any);

      // Load sub-categories first if category is selected
      if (product.categoryId) {
        await fetchSubCategories(product.categoryId.toString());
      }

      // Set form data
      setFormData({
        categoryId: product.categoryId?.toString() || "",
        name: product.name || "",
        subCategoryId: product.subCategoryId?.toString() || "",
        productType: product.productType || "normal",
        description: product.description || "",
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
      });

      // Set product image
      if (product.image_url || product.imgUrl) {
        setImagePreview(product.image_url || product.imgUrl);
      }

      // Map SKUs from API response to form structure
      if (product.skus && product.skus.length > 0) {
        const mappedSkus = product.skus.map((sku: any) => ({
          id: sku.id,
          name: sku.name || "",
          unitName: sku.unit?.name || "",
          unitSize: sku.unit?.size || "",
          currentPrice: sku.pricing?.currentPrice || 0,
          stockQuantity: sku.stockQuantity || 0,
          originalPrice: sku.pricing?.originalPrice || 0,
          weight: sku.metaData?.weight || 0,
          color: sku.metaData?.color || "",
          length: sku.metaData?.length || 0,
          width: sku.metaData?.width || 0,
          height: sku.metaData?.height || 0,
        }));
        setSkus(mappedSkus);

        // Set SKU images
        const skuImageMap: { [key: number]: string } = {};
        product.skus.forEach((sku: any, index: number) => {
          if (sku.image_url || sku.imgUrl) {
            skuImageMap[index] = sku.image_url || sku.imgUrl || "";
          }
        });
        setSkuImages(skuImageMap);
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      toast.error("Failed to load product details");
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    setFormData((prev) => ({ ...prev, categoryId, subCategoryId: "" }));
    fetchSubCategories(categoryId);
  };

  const updateField = (
    field: keyof ProductFormData,
    value: string | boolean | File
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("imgUrl", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, imgUrl: undefined }));
    const fileInput = document.getElementById("productImg") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // SKU Management
  const addSku = () => {
    setSkus([
      ...skus,
      {
        name: "",
        unitName: "",
        unitSize: "",
        currentPrice: 0,
        stockQuantity: 0,
        originalPrice: 0,
        weight: 0,
        color: "",
        length: 0,
        width: 0,
        height: 0,
      },
    ]);
  };

  const removeSku = (index: number) => {
    if (skus.length > 1) {
      setSkus(skus.filter((_, i) => i !== index));
      const newSkuImages = { ...skuImages };
      delete newSkuImages[index];
      setSkuImages(newSkuImages);
    }
  };

  const updateSku = (
    index: number,
    field: keyof ProductSku,
    value: string | number | File
  ) => {
    const newSkus = [...skus];
    newSkus[index] = { ...newSkus[index], [field]: value };
    setSkus(newSkus);
  };

  const handleSkuImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      updateSku(index, "imgUrl", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSkuImages((prev) => ({ ...prev, [index]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSkuImage = (index: number) => {
    const newSkuImages = { ...skuImages };
    delete newSkuImages[index];
    setSkuImages(newSkuImages);
    const newSkus = [...skus];
    newSkus[index] = { ...newSkus[index], imgUrl: undefined };
    setSkus(newSkus);
    const fileInput = document.getElementById(
      `skuImg-${index}`
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.name) {
      toast.error("Please enter product name");
      return;
    }

    // Validate at least one SKU with required fields
    const hasValidSku = skus.some(
      (sku) =>
        sku.name &&
        sku.unitName &&
        sku.unitSize &&
        sku.currentPrice > 0 &&
        sku.stockQuantity > 0
    );

    if (!hasValidSku) {
      toast.error(
        "Please add at least one SKU with name, unit, size, price, and stock"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("categoryId", formData.categoryId);
      formDataToSubmit.append("name", formData.name);
      if (formData.subCategoryId) {
        formDataToSubmit.append("subCategoryId", formData.subCategoryId);
      }
      formDataToSubmit.append("productType", formData.productType);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("isActive", formData.isActive ? "1" : "0");
      formDataToSubmit.append("isFeatured", formData.isFeatured ? "1" : "0");

      if (formData.imgUrl) {
        formDataToSubmit.append("imgUrl", formData.imgUrl);
      }

      // Add SKUs as JSON string with images
      skus.forEach((sku, index) => {
        Object.keys(sku).forEach((key) => {
          const value = sku[key as keyof ProductSku];
          if (
            value !== undefined &&
            value !== "" &&
            key !== "imgUrl" &&
            key !== "id"
          ) {
            formDataToSubmit.append(`skus[${index}][${key}]`, value.toString());
          }
        });

        // Add SKU image if exists (only if it's a new File upload)
        if (
          sku.imgUrl &&
          typeof sku.imgUrl === "object" &&
          "name" in sku.imgUrl
        ) {
          formDataToSubmit.append(`skus[${index}][imgUrl]`, sku.imgUrl as File);
        }
      });

      if (isEditMode && id) {
        await productService.updateItem(id, formDataToSubmit);
        toast.success("Product updated successfully");
      } else {
        await productService.storeItem(formDataToSubmit);
        toast.success("Product created successfully");
      }
      await productService.fetchLists();
      navigate("/products");
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(
        isEditMode ? "Failed to update product" : "Failed to create product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      {isLoadingProduct ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">
                Loading product details...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="mb-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {isEditMode ? "Edit Product" : t("productCreate.basicInfo")}
                <Button onClick={() => navigate("/products")}>
                  <Undo2 />
                  Back
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="grid gap-2">
                  <Label htmlFor="productName">
                    {t("productCreate.productName")} *
                  </Label>
                  <Input
                    id="productName"
                    placeholder={t("productCreate.productNamePlaceholder")}
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div className="grid gap-2">
                  <Label htmlFor="category">
                    {t("productCreate.category")} *
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={handleCategoryChange}
                    required
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger id="category">
                      <SelectValue
                        placeholder={
                          isLoadingCategories
                            ? "Loading..."
                            : t("productCreate.selectCategory")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub Category */}
                <div className="grid gap-2">
                  <Label htmlFor="subCategory">Sub Category</Label>
                  <Select
                    value={formData.subCategoryId}
                    onValueChange={(value) =>
                      updateField("subCategoryId", value)
                    }
                    disabled={subCategories.length === 0}
                  >
                    <SelectTrigger id="subCategory">
                      <SelectValue
                        placeholder={
                          isLoadingSubCategories
                            ? "Loading..."
                            : subCategories.length === 0
                            ? "No sub-categories"
                            : "Select sub-category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((subCat) => (
                        <SelectItem
                          key={subCat.id}
                          value={subCat.id.toString()}
                        >
                          {subCat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Type */}
                <div className="grid gap-2">
                  <Label htmlFor="productType">Product Type *</Label>
                  <Select
                    value={formData.productType}
                    onValueChange={(
                      value: "normal" | "subscription" | "bundle"
                    ) => updateField("productType", value)}
                    required
                  >
                    <SelectTrigger id="productType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="bundle">Bundle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">
                  {t("productCreate.description")}
                </Label>
                <Textarea
                  id="description"
                  placeholder={t("productCreate.descriptionPlaceholder")}
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Product Image */}
              <div className="grid gap-2">
                <Label htmlFor="productImg">
                  {t("productCreate.productImage")}
                </Label>
                <Input
                  id="productImg"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="relative inline-block mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 rounded-md object-cover object-top"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Status Switches */}
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      updateField("isActive", checked)
                    }
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      updateField("isFeatured", checked)
                    }
                  />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SKUs Section */}
          <Card className="my-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product SKUs</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSku}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add SKU
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {skus.map((sku, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-4 relative"
                >
                  {skus.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeSku(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}

                  <h4 className="font-medium">SKU {index + 1}</h4>

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* SKU Name */}
                    <div className="grid gap-2">
                      <Label htmlFor={`sku-name-${index}`}>SKU Name *</Label>
                      <Input
                        id={`sku-name-${index}`}
                        placeholder="e.g., Large White"
                        value={sku.name}
                        onChange={(e) =>
                          updateSku(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>

                    {/* Unit Name */}
                    <div className="grid gap-2">
                      <Label htmlFor={`unit-name-${index}`}>Unit Name *</Label>
                      <Input
                        id={`unit-name-${index}`}
                        placeholder="e.g., Bottle, Bag, Piece"
                        value={sku.unitName}
                        onChange={(e) =>
                          updateSku(index, "unitName", e.target.value)
                        }
                        required
                      />
                    </div>

                    {/* Unit Size */}
                    <div className="grid gap-2">
                      <Label htmlFor={`unit-size-${index}`}>Unit Size *</Label>
                      <Input
                        id={`unit-size-${index}`}
                        placeholder="e.g., 1L, 500g, 12oz"
                        value={sku.unitSize}
                        onChange={(e) =>
                          updateSku(index, "unitSize", e.target.value)
                        }
                        required
                      />
                    </div>

                    {/* Current Price */}
                    <div className="grid gap-2">
                      <Label htmlFor={`current-price-${index}`}>
                        Current Price *
                      </Label>
                      <Input
                        id={`current-price-${index}`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={sku.currentPrice || ""}
                        onChange={(e) =>
                          updateSku(
                            index,
                            "currentPrice",
                            Number(e.target.value)
                          )
                        }
                        required
                      />
                    </div>

                    {/* Original Price */}
                    <div className="grid gap-2">
                      <Label htmlFor={`original-price-${index}`}>
                        Original Price
                      </Label>
                      <Input
                        id={`original-price-${index}`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={sku.originalPrice || ""}
                        onChange={(e) =>
                          updateSku(
                            index,
                            "originalPrice",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>

                    {/* Stock Quantity */}
                    <div className="grid gap-2">
                      <Label htmlFor={`stock-${index}`}>Stock Quantity *</Label>
                      <Input
                        id={`stock-${index}`}
                        type="number"
                        placeholder="0"
                        value={sku.stockQuantity || ""}
                        onChange={(e) =>
                          updateSku(
                            index,
                            "stockQuantity",
                            Number(e.target.value)
                          )
                        }
                        required
                      />
                    </div>

                    {/* Weight */}
                    <div className="grid gap-2">
                      <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                      <Input
                        id={`weight-${index}`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={sku.weight || ""}
                        onChange={(e) =>
                          updateSku(index, "weight", Number(e.target.value))
                        }
                      />
                    </div>

                    {/* Color */}
                    <div className="grid gap-2">
                      <Label htmlFor={`color-${index}`}>Color</Label>
                      <Input
                        id={`color-${index}`}
                        placeholder="e.g., White, Red"
                        value={sku.color || ""}
                        onChange={(e) =>
                          updateSku(index, "color", e.target.value)
                        }
                      />
                    </div>

                    {/* Length */}
                    <div className="grid gap-2">
                      <Label htmlFor={`length-${index}`}>Length (cm)</Label>
                      <Input
                        id={`length-${index}`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={sku.length || ""}
                        onChange={(e) =>
                          updateSku(index, "length", Number(e.target.value))
                        }
                      />
                    </div>

                    {/* Width */}
                    <div className="grid gap-2">
                      <Label htmlFor={`width-${index}`}>Width (cm)</Label>
                      <Input
                        id={`width-${index}`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={sku.width || ""}
                        onChange={(e) =>
                          updateSku(index, "width", Number(e.target.value))
                        }
                      />
                    </div>

                    {/* Height */}
                    <div className="grid gap-2">
                      <Label htmlFor={`height-${index}`}>Height (cm)</Label>
                      <Input
                        id={`height-${index}`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={sku.height || ""}
                        onChange={(e) =>
                          updateSku(index, "height", Number(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  {/* SKU Image */}
                  <div className="grid gap-2">
                    <Label htmlFor={`skuImg-${index}`}>SKU Image</Label>
                    <Input
                      id={`skuImg-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSkuImageChange(e, index)}
                    />
                    {skuImages[index] && (
                      <div className="relative inline-block mt-2">
                        <img
                          src={skuImages[index]}
                          alt="SKU Preview"
                          className="h-24 w-24 rounded-md object-cover object-top"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => handleRemoveSkuImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 my-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : isEditMode
                ? "Update Product"
                : t("productCreate.createProduct")}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
