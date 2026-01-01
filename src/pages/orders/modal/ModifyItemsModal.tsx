import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import orderService from "@/services/orderService";
import type { PackageOrderItem } from "@/lib/types";

interface ModifyItemsModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  currentItems: PackageOrderItem[];
  onSuccess: () => void;
}

export default function ModifyItemsModal({
  open,
  onClose,
  orderId,
  currentItems,
  onSuccess,
}: ModifyItemsModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<PackageOrderItem[]>([]);

  useEffect(() => {
    if (open) {
      setItems([...currentItems]);
    }
  }, [open, currentItems]);

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = Math.max(1, quantity).toString();
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    } else {
      toast.error(
        t("orders.packageOrders.modals.modifyItems.validation.minimumOneItem")
      );
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await orderService.modifyPackageOrderItems(orderId, {
        addons: items.map((item) => ({
          product_id: parseInt(item.product_id),
          sku_id: parseInt(item.sku_id),
          quantity: parseInt(item.quantity),
        })),
      });
      toast.success(t("orders.packageOrders.messages.itemsModified"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error modifying items:", error);
      toast.error(
        error.response.data.error_message ||
          t("orders.packageOrders.messages.failedToModify")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("orders.packageOrders.modals.modifyItems.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("save")}
      size="xl"
    >
      <div className="space-y-4">
        <div>
          <Label>{t("orders.packageOrders.modals.modifyItems.items")}</Label>
          <div className="border rounded-lg mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t("orders.packageOrders.modals.modifyItems.product")}
                  </TableHead>
                  <TableHead className="w-32">
                    {t("orders.packageOrders.modals.modifyItems.quantity")}
                  </TableHead>
                  <TableHead className="w-24">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={`${item.product_id}-${item.sku_id}`}>
                    <TableCell className="flex items-center gap-3">
                      <div className="w-12 h-12">
                        <img
                          className="w-full h-full object-cover object-top"
                          src={item.image || ""}
                          alt={item.product_name}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-sm text-gray-500">
                          {item.sku_name}
                        </div>
                        <div className="text-xs text-gray-400">
                          SKU: {item.sku_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            index,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
