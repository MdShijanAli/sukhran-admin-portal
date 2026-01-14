import { useState, useEffect } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";
import BaseSelect from "@/components/custom/BaseSelect";
import productService from "@/services/productService";

interface SKU {
  id: number;
  customSkuId: string;
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
    color: string | null;
    length: string;
    width: string;
    height: string;
  };
}

interface ProductDetails {
  id: number;
  name: string;
  skus: SKU[];
}

interface AddItemData {
  productId: string;
  skuId: string;
  quantity: number;
  reason: string;
}

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: AddItemData) => Promise<void>;
  isSubmitting: boolean;
}

export default function AddItemModal({
  open,
  onClose,
  onConfirm,
  isSubmitting,
}: AddItemModalProps) {
  const [itemData, setItemData] = useState<AddItemData>({
    productId: "",
    skuId: "",
    quantity: 1,
    reason: "",
  });
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );
  const [isFetchingSkus, setIsFetchingSkus] = useState(false);

  // Fetch product details when product is selected
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!itemData.productId) {
        setProductDetails(null);
        return;
      }

      try {
        setIsFetchingSkus(true);
        const response = await productService.fetchDetails(itemData.productId);
        const product = response?.product || response;
        console.log("Fetched product details:", product);
        setProductDetails(product.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProductDetails(null);
      } finally {
        setIsFetchingSkus(false);
      }
    };

    fetchProductDetails();
  }, [itemData.productId]);

  const handleSubmit = async () => {
    await onConfirm(itemData);
    setItemData({
      productId: "",
      skuId: "",
      quantity: 1,
      reason: "",
    });
  };

  const handleClose = () => {
    setItemData({
      productId: "",
      skuId: "",
      quantity: 1,
      reason: "",
    });
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={handleClose}
      title="Add New Item to Order"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Add Item"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="add-product">
            Product <span className="text-red-500">*</span>
          </Label>
          <BaseSelect
            id="add-product"
            value={itemData.productId}
            onValueChange={(value: string) =>
              setItemData((prev) => ({
                ...prev,
                productId: value,
                skuId: "", // Reset SKU when product changes
              }))
            }
            apiMethod={productService.fetchLists}
            placeholder="Select a product"
            searchable
            searchPlaceholder="Search products..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="add-sku">
            SKU <span className="text-red-500">*</span>
          </Label>
          {/* <Select
            value={itemData.skuId}
            onValueChange={(value) =>
              setItemData((prev) => ({ ...prev, skuId: value }))
            }
            disabled={!itemData.productId || isFetchingSkus}
          >
            <SelectTrigger id="add-sku">
              <SelectValue placeholder="Select SKU" />
            </SelectTrigger>
            <SelectContent>
              {isFetchingSkus ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Loading SKUs...
                </div>
              ) : !productDetails || productDetails?.skus?.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No SKUs available
                </div>
              ) : (
                productDetails?.skus?.map((sku) => (
                  <SelectItem key={sku.id} value={sku.id.toString()}>
                    {sku.name} - ৳{sku.pricing.currentPrice}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select> */}

          <BaseSelect
            id="add-sku"
            value={itemData.skuId}
            onValueChange={(value) =>
              setItemData((prev) => ({ ...prev, skuId: value }))
            }
            disabled={!itemData.productId || isFetchingSkus}
            options={
              productDetails?.skus.map((sku) => ({
                label: `${sku.name} - ৳${sku.pricing.currentPrice}`,
                value: sku.id.toString(),
              })) || []
            }
            searchable
            placeholder="Select a SKU"
            searchPlaceholder="Search SKUs..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="add-quantity">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                if (itemData.quantity > 1) {
                  setItemData((prev) => ({
                    ...prev,
                    quantity: prev.quantity - 1,
                  }));
                }
              }}
              disabled={itemData.quantity === 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="add-quantity"
              type="number"
              min="1"
              value={itemData.quantity}
              onChange={(e) =>
                setItemData((prev) => ({
                  ...prev,
                  quantity: parseInt(e.target.value) || 1,
                }))
              }
              className="text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                setItemData((prev) => ({
                  ...prev,
                  quantity: prev.quantity + 1,
                }));
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="add-reason">
            Reason <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="add-reason"
            value={itemData.reason}
            onChange={(e) =>
              setItemData((prev) => ({ ...prev, reason: e.target.value }))
            }
            placeholder="e.g., Customer requested additional item via phone call"
            rows={3}
            required
          />
        </div>
      </div>
    </BaseModal>
  );
}
