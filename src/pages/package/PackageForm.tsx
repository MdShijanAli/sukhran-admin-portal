import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { ArrowLeft, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import packageService from "@/services/packageService";
import productService from "@/services/productService";
import { Product } from "@/stores/productStore";
import { Badge } from "@/components/ui/badge";

interface PackageFormData {
  name: string;
  description: string;
  packageType: "admin" | "custom";
  fixedPrice: string;
  discountPercent: string;
  displayOrder: string;
  isActive: boolean;
  isFeatured: boolean;
  imgUrl?: File;
}

interface PackageItem {
  productId: string;
  skuId: string;
  quantity: string;
}

export default function PackageForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPackage, setIsLoadingPackage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    description: "",
    packageType: "admin",
    fixedPrice: "",
    discountPercent: "0",
    displayOrder: "0",
    isActive: true,
    isFeatured: false,
  });

  const [items, setItems] = useState<PackageItem[]>([
    {
      productId: "",
      skuId: "",
      quantity: "1",
    },
  ]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch package details if editing
  useEffect(() => {
    if (isEditMode && id) {
      fetchPackageDetails(id);
    }
  }, [isEditMode, id]);

  // Debounced product search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(productSearchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [productSearchQuery]);

  const fetchProducts = async (searchQuery = "") => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      const result = await productService.fetchLists(params.toString());
      const productsData = (result as { data?: Product[] })?.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(t("packages.messages.failedToLoadProducts"));
    } finally {
      setIsSearching(false);
    }
  };

  const fetchPackageDetails = async (packageId: string) => {
    setIsLoadingPackage(true);
    try {
      const result = await packageService.fetchDetails(packageId);
      const packageData = (result as { data?: any })?.data || result;

      setFormData({
        name: packageData.name || "",
        description: packageData.description || "",
        packageType: packageData.packageType || "admin",
        fixedPrice:
          packageData.pricing?.fixedPrice?.toString() ||
          packageData.fixedPrice?.toString() ||
          "",
        discountPercent:
          packageData.pricing?.discountPercent?.toString() ||
          packageData.discountPercent?.toString() ||
          "0",
        displayOrder: packageData.displayOrder?.toString() || "0",
        isActive: packageData.isActive ?? true,
        isFeatured: packageData.isFeatured ?? false,
      });

      if (packageData.image_url || packageData.imgUrl) {
        setImagePreview(packageData.image_url || packageData.imgUrl);
      }

      if (packageData.items && packageData.items.length > 0) {
        setItems(
          packageData.items.map((item: any) => ({
            productId: item.product?.id?.toString() || "",
            skuId: item.sku?.id?.toString() || "",
            quantity: item.quantity?.toString() || "1",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching package details:", error);
      toast.error(t("packages.messages.failedToLoadDetails"));
    } finally {
      setIsLoadingPackage(false);
    }
  };

  const updateField = (
    field: keyof PackageFormData,
    value: string | boolean | File
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imgUrl: file }));
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
    const fileInput = document.getElementById("packageImg") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Package Items Management
  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        skuId: "",
        quantity: "1",
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const updateItem = (
    index: number,
    field: keyof PackageItem,
    value: string
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Reset SKU when product changes
    if (field === "productId") {
      newItems[index].skuId = "";
    }

    setItems(newItems);
  };

  const getProductById = (productId: string) => {
    return products.find((p) => p.id.toString() === productId);
  };

  const getSkusForProduct = (productId: string) => {
    const product = getProductById(productId);
    return product?.skus || [];
  };

  const calculateTotalPrice = () => {
    let total = 0;
    items.forEach((item) => {
      if (item.productId && item.skuId && item.quantity) {
        const product = getProductById(item.productId);
        const sku = product?.skus?.find((s) => s.id?.toString() === item.skuId);
        if (sku && sku.pricing) {
          total += sku.pricing.currentPrice * parseFloat(item.quantity);
        }
      }
    });
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error(t("packages.messages.packageNameRequired"));
      return;
    }
    // Validate at least one item with complete data
    const hasValidItem = items.some(
      (item) =>
        item.productId &&
        item.skuId &&
        item.quantity &&
        parseFloat(item.quantity) > 0
    );

    if (!hasValidItem) {
      toast.error(t("packages.messages.addAtLeastOneItem"));
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();

      // Append basic fields
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("packageType", formData.packageType);
      formDataToSubmit.append("fixedPrice", formData.fixedPrice);
      formDataToSubmit.append("discountPercent", formData.discountPercent);
      formDataToSubmit.append("displayOrder", formData.displayOrder);
      formDataToSubmit.append("isActive", formData.isActive ? "1" : "0");
      formDataToSubmit.append("isFeatured", formData.isFeatured ? "1" : "0");

      // Append image if exists
      if (formData.imgUrl) {
        formDataToSubmit.append("imgUrl", formData.imgUrl);
      }

      // Append items
      items.forEach((item, index) => {
        if (item.productId && item.skuId && item.quantity) {
          formDataToSubmit.append(`items[${index}][productId]`, item.productId);
          formDataToSubmit.append(`items[${index}][skuId]`, item.skuId);
          formDataToSubmit.append(`items[${index}][quantity]`, item.quantity);
        }
      });

      if (isEditMode && id) {
        formDataToSubmit.append("_method", "PUT");
        await packageService.updateItem(id, formDataToSubmit);
        toast.success(t("packages.messages.packageUpdated"));
      } else {
        await packageService.storeItem(formDataToSubmit);
        toast.success(t("packages.messages.packageCreated"));
      }

      navigate("/packages");
    } catch (error: any) {
      console.error("Error saving package:", error);
      toast.error(
        error?.response?.data?.message || t("packages.messages.failedToSave")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = calculateTotalPrice();
  const fixedPriceNum = parseFloat(formData.fixedPrice) || 0;
  const discountPercentNum = parseFloat(formData.discountPercent) || 0;

  // Calculate final price based on scenarios:
  // 1. If fixed price exists, use it as base
  // 2. If no fixed price, use total price as base
  // 3. Apply discount percentage on the base price
  const basePrice = fixedPriceNum > 0 ? fixedPriceNum : totalPrice;

  const priceAfterDiscount =
    discountPercentNum > 0
      ? basePrice - (basePrice * discountPercentNum) / 100
      : basePrice;

  // Calculate savings compared to original total price
  const savings =
    totalPrice > priceAfterDiscount ? totalPrice - priceAfterDiscount : 0;

  return (
    <div className="">
      {isLoadingPackage ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              {t("packages.loadingPackageDetails")}
            </p>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate("/packages")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">
                {isEditMode
                  ? t("packages.form.editPackage")
                  : t("packages.form.createNewPackage")}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditMode
                  ? t("packages.form.updatePackageDetails")
                  : t("packages.form.fillPackageDetails")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/packages")}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading")}
                  </>
                ) : (
                  <>
                    {isEditMode
                      ? t("packages.form.updatePackage")
                      : t("packages.createPackage")}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-3">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("packages.form.basicInformation")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {t("packages.form.packageName")}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder={t("packages.form.enterPackageName")}
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      {t("packages.form.description")}
                    </Label>
                    <Textarea
                      id="description"
                      placeholder={t("packages.form.enterDescription")}
                      value={formData.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="packageType">
                        {t("packages.form.packageType")}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.packageType}
                        onValueChange={(value) =>
                          updateField("packageType", value)
                        }
                      >
                        <SelectTrigger id="packageType">
                          <SelectValue
                            placeholder={t("packages.form.selectType")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            {t("packages.type.admin")}
                          </SelectItem>
                          <SelectItem value="custom">
                            {t("packages.type.custom")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="displayOrder">
                        {t("packages.form.displayOrder")}
                      </Label>
                      <Input
                        id="displayOrder"
                        type="number"
                        placeholder="0"
                        value={formData.displayOrder}
                        onChange={(e) =>
                          updateField("displayOrder", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Package Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t("packages.form.packageItems")}</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addItem}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t("packages.form.addItem")}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item, index) => {
                    const selectedProduct = getProductById(item.productId);
                    const availableSkus = getSkusForProduct(item.productId);
                    const selectedSku = availableSkus.find(
                      (s) => s.id?.toString() === item.skuId
                    );

                    return (
                      <Card key={index} className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {t("packages.form.item")} {index + 1}
                            </h4>
                            {items.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <Label>
                                {t("packages.form.product")}{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Select
                                value={item.productId}
                                onValueChange={(value) =>
                                  updateItem(index, "productId", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t(
                                      "packages.form.selectProduct"
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-2">
                                    <Input
                                      placeholder={t(
                                        "packages.form.searchProducts"
                                      )}
                                      value={productSearchQuery}
                                      onChange={(e) =>
                                        setProductSearchQuery(e.target.value)
                                      }
                                      className="h-8"
                                    />
                                  </div>
                                  <div className="max-h-[200px] overflow-y-auto">
                                    {isSearching ? (
                                      <div className="py-6 text-center text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                                        {t("packages.form.searching")}
                                      </div>
                                    ) : products.length === 0 ? (
                                      <div className="py-6 text-center text-sm text-muted-foreground">
                                        {t("packages.form.noProductsFound")}
                                      </div>
                                    ) : (
                                      products.map((product) => (
                                        <SelectItem
                                          key={product.id}
                                          value={product.id.toString()}
                                        >
                                          {product.name}
                                        </SelectItem>
                                      ))
                                    )}
                                  </div>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>
                                {t("packages.form.sku")}{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Select
                                value={item.skuId}
                                onValueChange={(value) =>
                                  updateItem(index, "skuId", value)
                                }
                                disabled={!item.productId}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t("packages.form.selectSku")}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableSkus.map((sku) => (
                                    <SelectItem
                                      key={sku.id}
                                      value={sku.id!.toString()}
                                    >
                                      {sku.name} - ৳{sku.pricing.currentPrice}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>
                                {t("packages.form.quantity")}{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                type="number"
                                min="1"
                                placeholder="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItem(index, "quantity", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          {selectedSku && item.quantity && (
                            <div className="rounded-lg bg-muted p-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t("packages.form.subtotal")}
                                </span>
                                <span className="font-medium">
                                  ৳
                                  {(
                                    (selectedSku.pricing?.currentPrice ||
                                      selectedSku.currentPrice ||
                                      0) * parseFloat(item.quantity)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Package Image */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("packages.form.packageImage")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Package preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <Label
                        htmlFor="packageImg"
                        className="cursor-pointer text-sm text-muted-foreground"
                      >
                        {t("packages.form.clickToUpload")}
                      </Label>
                      <Input
                        id="packageImg"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-3">
              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("packages.form.pricing")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fixedPrice">
                        {t("packages.form.fixedPrice")}
                      </Label>
                      <Input
                        id="fixedPrice"
                        type="number"
                        step="0.01"
                        placeholder={t("packages.form.enterFixedPrice")}
                        value={formData.fixedPrice}
                        onChange={(e) =>
                          updateField("fixedPrice", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountPercent">
                        {t("packages.form.discountPercent")}
                      </Label>
                      <Input
                        id="discountPercent"
                        type="number"
                        step="0.01"
                        placeholder={t("packages.form.enterDiscount")}
                        value={formData.discountPercent}
                        onChange={(e) =>
                          updateField("discountPercent", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {totalPrice > 0 && (
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t("packages.form.totalProductValue")}</span>
                        <span className="font-medium">
                          ৳{totalPrice.toFixed(2)}
                        </span>
                      </div>
                      {fixedPriceNum > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>{t("packages.form.fixedPrice")}</span>
                          <span className="font-bold text-primary">
                            ৳{fixedPriceNum.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {discountPercentNum > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>
                            {t("packages.form.afterDiscount")} (
                            {discountPercentNum}%):
                          </span>
                          <span className="font-bold text-green-600">
                            ৳{priceAfterDiscount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {!discountPercentNum && fixedPriceNum > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>{t("packages.form.finalPrice")}</span>
                          <span className="font-bold text-green-600">
                            ৳{priceAfterDiscount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {!fixedPriceNum && discountPercentNum > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>{t("packages.form.discountedPrice")}</span>
                          <span className="font-bold text-green-600">
                            ৳{priceAfterDiscount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {savings > 0 && (
                        <div className="flex justify-between text-sm font-medium border-t pt-2 mt-2">
                          <span className="text-green-600">
                            {t("packages.form.youSave")}
                          </span>
                          <span className="text-green-600">
                            ৳{savings.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="">
                <CardHeader>
                  <CardTitle>{t("packages.form.settings")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">
                      {t("packages.form.activeStatus")}
                    </Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        updateField("isActive", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isFeatured">
                      {t("packages.form.featured")}
                    </Label>
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        updateField("isFeatured", checked)
                      }
                    />
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <h4 className="font-medium">
                      {t("packages.form.packageSummary")}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("packages.form.items")}
                        </span>
                        <Badge variant="secondary">
                          {items.filter((i) => i.productId && i.skuId).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("packages.form.typeLabel")}
                        </span>
                        <Badge variant="outline" className="capitalize">
                          {t(`packages.type.${formData.packageType}`)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("packages.form.statusLabel")}
                        </span>
                        <Badge
                          variant={formData.isActive ? "default" : "secondary"}
                        >
                          {formData.isActive
                            ? t("packages.status.active")
                            : t("packages.status.inactive")}
                        </Badge>
                      </div>
                      {formData.isFeatured && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("packages.form.featuredLabel")}
                          </span>
                          <Badge>{t("packages.form.yes")}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
