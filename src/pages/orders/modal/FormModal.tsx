import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal, DeleteModal } from "@/components/modals";
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
import { toast } from "sonner";
import { Order } from "@/stores/orderStore";
import orderService from "@/services/orderService";
import { Plus, Trash2 } from "lucide-react";
import { formatNumberWithCommas, unFormatNumberWithCommas } from "@/lib/utils";
import BaseSelect from "@/components/custom/BaseSelect";
import productService from "@/services/productService";
import QuantityUpdateModal from "./QuantityUpdateModal";
import AddItemModal from "./AddItemModal";

interface FormOrderItem {
  id: string;
  product_id: string;
  orderId?: string;
  itemType?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  isEnabled?: boolean;
}

interface OrderFormData {
  orderId?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  items: FormOrderItem[];
  subtotal: number;
  discount: number;
  delivery_fee: number;
  total: number;
  payment_method: "cash" | "online" | "card";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "in-transit"
    | "delivered"
    | "cancelled";
  delivery_agent_id?: string;
  notes?: string;
}

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  orderId?: string;
  onSuccess?: () => void;
}

export default function FormModal({
  open,
  onClose,
  orderId,
  onSuccess,
}: FormModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    delivery_address: "",
    items: [],
    subtotal: 0,
    discount: 0,
    delivery_fee: 0,
    total: 0,
    payment_method: "cash",
    payment_status: "pending",
    status: "pending",
    delivery_agent_id: "",
    notes: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FormOrderItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [showQuantityUpdateModal, setShowQuantityUpdateModal] = useState(false);
  const [quantityUpdateData, setQuantityUpdateData] = useState<{
    index: number;
    newQuantity: number;
    oldQuantity: number;
  } | null>(null);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !open) {
        setIsEditing(false);
        setFormData({
          customer_name: "",
          customer_phone: "",
          customer_email: "",
          delivery_address: "",
          items: [],
          subtotal: 0,
          discount: 0,
          delivery_fee: 0,
          total: 0,
          payment_method: "cash",
          payment_status: "pending",
          status: "pending",
          delivery_agent_id: "",
          notes: "",
        });
        return;
      }

      setIsEditing(true);
      setIsLoading(true);
      try {
        const response = await orderService.fetchDetails(orderId);
        const responseData = response as unknown as Record<string, unknown>;
        const orderData =
          (responseData?.order as Order) || (response as unknown as Order);

        console.log("Fetched order details for editing:", orderData);

        // Map API response to form data
        const addressParts = [
          orderData.address.house,
          orderData.address.road,
          orderData.address.block,
          orderData.address.area,
          orderData.address.city,
          orderData.address.zipCode,
        ]
          .filter(Boolean)
          .join(", ");

        setFormData({
          orderId: orderData.orderId,
          customer_name: orderData.customer.name,
          customer_phone: orderData.customer.mobile,
          customer_email: orderData.customer.email || "",
          delivery_address: addressParts,
          items: orderData.items.map((item: any) => ({
            id: item.id.toString(),
            product_id: item.product?.id?.toString() || "",
            product_name: item.product?.name || "Package",
            quantity: parseInt(item.quantity) || 1,
            unit_price: item.unitPrice,
            total_price: item.itemCost,
            isEnabled: false,
            orderId: orderData.orderId,
          })),
          subtotal: orderData.receipt.subTotal,
          discount: orderData.receipt.discount,
          delivery_fee: orderData.receipt.deliveryCharge,
          total: orderData.receipt.grandTotal,
          payment_method: orderData.paymentMode as "cash" | "online" | "card",
          payment_status: orderData.paymentStatus as
            | "pending"
            | "paid"
            | "failed"
            | "refunded",
          status: orderData.status,
          delivery_agent_id: "",
          notes: orderData.customerNotes || "",
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error(t("orders.messages.failedToFetchDetails"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, open, t]);

  const calculateTotals = (
    items: FormOrderItem[],
    discount: number,
    deliveryFee: number,
  ) => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const total = subtotal - discount + deliveryFee;
    return { subtotal, total };
  };

  const handleAddItem = () => {
    if (isEditing) {
      // Show modal when editing existing order
      setShowAddItemModal(true);
    } else {
      // Directly add to form when creating new order
      setFormData((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            id: Date.now().toString(),
            product_id: "",
            itemType: "product",
            product_name: "",
            quantity: 1,
            unit_price: 0,
            total_price: 0,
            isEnabled: true,
          },
        ],
      }));
    }
  };

  const handleRemoveItem = (item: FormOrderItem) => {
    if (item.isEnabled) {
      // If the item is newly added and not saved yet, just remove it from the form state
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== item.id),
      }));
      return;
    }
    setShowDeleteModal(true);
    setSelectedItem(item);
    console.log("Selected item for deletion:", item);
  };

  const handleDeleteOrderItem = async () => {
    if (!selectedItem) return;
    if (!selectedItem.product_id || !selectedItem.orderId) {
      toast.error(t("orders.messages.failedToDeleteItem"));
      return;
    }
    try {
      setIsDeleting(true);
      const response = await orderService.removeItemFromOrder(
        selectedItem.orderId,
        selectedItem.id,
        deleteReason,
      );
      console.log("Delete item response:", response);
      toast.success(t("orders.messages.itemDeleted"));

      // Refresh order details
      if (orderId) {
        const refreshedOrder = await orderService.fetchDetails(orderId);
        const responseData = refreshedOrder as unknown as Record<
          string,
          unknown
        >;
        const orderData =
          (responseData?.order as Order) ||
          (refreshedOrder as unknown as Order);

        // Update form data with refreshed order
        setFormData((prev) => ({
          ...prev,
          items: orderData.items.map((item: any) => ({
            id: item.id.toString(),
            product_id: item.product?.id?.toString() || "",
            product_name: item.product?.name || "Package",
            quantity: parseInt(item.quantity) || 1,
            unit_price: item.unitPrice,
            total_price: item.itemCost,
            isEnabled: false,
            orderId: orderData.orderId,
          })),
          subtotal: orderData.receipt.subTotal,
          discount: orderData.receipt.discount,
          delivery_fee: orderData.receipt.deliveryCharge,
          total: orderData.receipt.grandTotal,
        }));
      }
    } catch (error) {
      console.error("Error deleting order item:", error);
      toast.error(t("orders.messages.failedToDeleteItem"));
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedItem(null);
      setDeleteReason("");
    }
  };

  const handleConfirmQuantityUpdate = async (reason: string) => {
    if (!quantityUpdateData || !reason.trim()) {
      toast.error("Please provide a reason for the quantity change");
      return;
    }

    const item = formData.items[quantityUpdateData.index];
    if (!item.orderId || !item.id) {
      toast.error("Invalid item data");
      return;
    }

    try {
      setIsUpdatingQuantity(true);
      await orderService.updateItemQuantity(
        item.orderId,
        item.id,
        quantityUpdateData.newQuantity,
        reason,
      );

      toast.success("Item quantity updated successfully");

      // Refresh order details to get updated data
      if (orderId) {
        const refreshedOrder = await orderService.fetchDetails(orderId);
        const responseData = refreshedOrder as unknown as Record<
          string,
          unknown
        >;
        const orderData =
          (responseData?.order as Order) ||
          (refreshedOrder as unknown as Order);

        setFormData((prev) => ({
          ...prev,
          items: orderData.items.map((item: any) => ({
            id: item.id.toString(),
            product_id: item.product?.id?.toString() || "",
            product_name: item.product?.name || "Package",
            quantity: parseInt(item.quantity) || 1,
            unit_price: item.unitPrice,
            total_price: item.itemCost,
            isEnabled: false,
            orderId: orderData.orderId,
          })),
          subtotal: orderData.receipt.subTotal,
          discount: orderData.receipt.discount,
          delivery_fee: orderData.receipt.deliveryCharge,
          total: orderData.receipt.grandTotal,
        }));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update item quantity");
    } finally {
      setIsUpdatingQuantity(false);
      setShowQuantityUpdateModal(false);
      setQuantityUpdateData(null);
    }
  };

  const handleConfirmAddItem = async (data: {
    productId: string;
    skuId: string;
    quantity: number;
    reason: string;
  }) => {
    if (!data.productId || !data.skuId || !data.reason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.orderId) {
      toast.error("Order ID is missing");
      return;
    }

    try {
      setIsAddingItem(true);
      await orderService.addItemToOrder(formData.orderId, {
        itemType: "product",
        productId: data.productId,
        skuId: data.skuId,
        quantity: data.quantity,
        reason: data.reason,
      });

      toast.success("Item added successfully");

      // Refresh order details
      const refreshedOrder = await orderService.fetchDetails(orderId);
      const responseData = refreshedOrder as unknown as Record<string, unknown>;
      const orderData =
        (responseData?.order as Order) || (refreshedOrder as unknown as Order);

      setFormData((prev) => ({
        ...prev,
        items: orderData.items.map((item: any) => ({
          id: item.id.toString(),
          product_id: item.product?.id?.toString() || "",
          product_name: item.product?.name || "Package",
          quantity: parseInt(item.quantity) || 1,
          unit_price: item.unitPrice,
          total_price: item.itemCost,
          isEnabled: false,
          orderId: orderData.orderId,
        })),
        subtotal: orderData.receipt.subTotal,
        discount: orderData.receipt.discount,
        delivery_fee: orderData.receipt.deliveryCharge,
        total: orderData.receipt.grandTotal,
      }));
      setShowAddItemModal(false);
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof FormOrderItem,
    value: string | number,
  ) => {
    const item = formData.items[index];

    // If changing quantity on an existing item (not newly added), show reason modal
    if (field === "quantity" && !item.isEnabled && value !== item.quantity) {
      setQuantityUpdateData({
        index,
        newQuantity: Number(value),
        oldQuantity: item.quantity,
      });
      setShowQuantityUpdateModal(true);
      return;
    }

    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calculate total price for the item
    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price =
        newItems[index].quantity * newItems[index].unit_price;
    }

    const { subtotal, total } = calculateTotals(
      newItems,
      formData.discount,
      formData.delivery_fee,
    );
    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      total,
    }));
  };

  const handleDiscountChange = (value: string) => {
    const discount = unFormatNumberWithCommas(value);
    const { total } = calculateTotals(
      formData.items,
      discount,
      formData.delivery_fee,
    );
    setFormData((prev) => ({ ...prev, discount, total }));
  };

  const handleDeliveryFeeChange = (value: string) => {
    const deliveryFee = unFormatNumberWithCommas(value);
    const { total } = calculateTotals(
      formData.items,
      formData.discount,
      deliveryFee,
    );
    setFormData((prev) => ({ ...prev, delivery_fee: deliveryFee, total }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.customer_name ||
      !formData.customer_phone ||
      !formData.delivery_address
    ) {
      toast.error(t("orders.messages.fillRequiredFields"));
      return;
    }

    if (formData.items.length === 0) {
      toast.error(t("orders.messages.addAtLeastOneItem"));
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && orderId) {
        // Check if there are new items to add
        const newItems = formData.items.filter((item) => item.isEnabled);

        if (newItems.length > 0) {
          // Add new items one by one
          for (const item of newItems) {
            if (!item.product_id) {
              toast.error(`Please select a product for all items`);
              setIsSubmitting(false);
              return;
            }

            await orderService.addItemToOrder(orderId, {
              itemType: "product",
              productId: item.product_id,
              skuId: item.product_id, // You may need to track SKU separately
              quantity: item.quantity,
              reason: "Added via admin panel",
            });
          }

          toast.success("New items added successfully");

          // Refresh the order
          const refreshedOrder = await orderService.fetchDetails(orderId);
          const responseData = refreshedOrder as unknown as Record<
            string,
            unknown
          >;
          const orderData =
            (responseData?.order as Order) ||
            (refreshedOrder as unknown as Order);

          setFormData((prev) => ({
            ...prev,
            items: orderData.items.map((item: any) => ({
              id: item.id.toString(),
              product_id: item.product?.id?.toString() || "",
              product_name: item.product?.name || "Package",
              quantity: parseInt(item.quantity) || 1,
              unit_price: item.unitPrice,
              total_price: item.itemCost,
              isEnabled: false,
              orderId: orderData.orderId,
            })),
            subtotal: orderData.receipt.subTotal,
            discount: orderData.receipt.discount,
            delivery_fee: orderData.receipt.deliveryCharge,
            total: orderData.receipt.grandTotal,
          }));
        }

        // Update other order details if needed
        await orderService.updateItem(orderId, {
          status: formData.status,
          notes: formData.notes,
        });

        toast.success(t("orders.messages.orderUpdated"));
      } else {
        await orderService.storeItem(formData);
        toast.success(t("orders.messages.orderCreated"));
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        isEditing
          ? t("orders.messages.failedToUpdate")
          : t("orders.messages.failedToCreate"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={
        isEditing ? t("orders.form.editOrder") : t("orders.form.createNewOrder")
      }
      showSubmitButton={false}
      // onSubmit={handleSubmit}
      // isSubmitting={isSubmitting || isLoading}
      // submitButtonText={
      //   isEditing ? t("orders.form.updateOrder") : t("orders.form.createOrder")
      // }
      size="4xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground">
              Loading order details...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">
              {t("orders.form.customerInfo")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">
                  {t("orders.form.customerName")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                  placeholder={t("orders.form.customerNamePlaceholder")}
                  disabled={isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_phone">
                  {t("orders.form.customerPhone")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_phone: e.target.value })
                  }
                  placeholder={t("orders.form.customerPhonePlaceholder")}
                  disabled={isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_email">
                  {t("orders.form.customerEmail")}
                </Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_email: e.target.value })
                  }
                  placeholder={t("orders.form.customerEmailPlaceholder")}
                  disabled={isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_address">
                  {t("orders.form.deliveryAddress")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="delivery_address"
                  value={formData.delivery_address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      delivery_address: e.target.value,
                    })
                  }
                  placeholder={t("orders.form.deliveryAddressPlaceholder")}
                  disabled={isEditing}
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-semibold">
                {t("orders.form.orderItems")}
              </h3>
              <Button
                type="button"
                onClick={handleAddItem}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("orders.form.addItem")}
              </Button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg"
                >
                  <div className="col-span-4 space-y-2">
                    <Label className="text-xs">
                      {t("orders.form.product")}
                    </Label>
                    {item.isEnabled ? (
                      <BaseSelect
                        id="product"
                        value={item.product_id}
                        onValueChange={(value: string) =>
                          handleItemChange(index, "product_id", value)
                        }
                        apiMethod={productService.fetchLists}
                        placeholder={t("orders.form.selectProduct")}
                        searchable
                        searchPlaceholder={t("products.form.searchBadges")}
                      />
                    ) : (
                      <Input
                        value={item.product_name}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "product_name",
                            e.target.value,
                          )
                        }
                        placeholder={t("orders.form.selectProduct")}
                        disabled={isEditing}
                      />
                    )}
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">
                      {t("orders.form.quantity")}
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">
                      {t("orders.form.unitPrice")}
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "unit_price",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      disabled={isEditing}
                    />
                  </div>

                  <div className="col-span-3 space-y-2">
                    <Label className="text-xs">
                      {t("orders.form.totalPrice")}
                    </Label>
                    <Input
                      value={formatNumberWithCommas(item.total_price)}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <Button
                      type="button"
                      onClick={() => handleRemoveItem(item)}
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">
              {t("orders.form.pricingDetails")}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">{t("orders.form.discount")}</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  disabled={isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_fee">
                  {t("orders.form.deliveryFee")}
                </Label>
                <Input
                  id="delivery_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.delivery_fee}
                  onChange={(e) => handleDeliveryFeeChange(e.target.value)}
                  disabled={isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("orders.form.subtotal")}</Label>
                <Input
                  value={formatNumberWithCommas(formData.subtotal)}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">
                  {t("orders.form.total")}
                </span>
                <span className="text-2xl ">
                  ৳{formatNumberWithCommas(formData.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t("orders.deleteDialog.title")}
        description={t("orders.deleteDialog.description", {
          name: selectedItem?.product_name || "",
        })}
        onConfirm={handleDeleteOrderItem}
        isDeleting={isDeleting}
      >
        <div className="space-y-2">
          <Label htmlFor="reason">{t("orders.form.deletionReason")} *</Label>
          <Textarea
            id="reason"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder={t("orders.form.deletionReasonPlaceholder")}
            rows={3}
            required
          />
        </div>
      </DeleteModal>

      <QuantityUpdateModal
        open={showQuantityUpdateModal}
        onClose={() => {
          setShowQuantityUpdateModal(false);
          setQuantityUpdateData(null);
        }}
        oldQuantity={quantityUpdateData?.oldQuantity || 0}
        newQuantity={quantityUpdateData?.newQuantity || 0}
        onQuantityChange={(quantity) => {
          if (quantityUpdateData) {
            setQuantityUpdateData({
              ...quantityUpdateData,
              newQuantity: quantity,
            });
          }
        }}
        onConfirm={handleConfirmQuantityUpdate}
        isSubmitting={isUpdatingQuantity}
      />

      <AddItemModal
        open={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onConfirm={handleConfirmAddItem}
        isSubmitting={isAddingItem}
      />
    </BaseModal>
  );
}
