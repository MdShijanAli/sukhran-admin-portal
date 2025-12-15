import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setItems([...currentItems]);
      setReason("");
      setError("");
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
    if (!reason.trim()) {
      setError(
        t("orders.packageOrders.modals.modifyItems.validation.reasonRequired")
      );
      return;
    }
    if (reason.trim().length < 10) {
      setError(
        t("orders.packageOrders.modals.modifyItems.validation.reasonMinLength")
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.modifyPackageOrderItems(orderId, {
        items: items.map((item) => ({
          sku_id: parseInt(item.sku_id),
          quantity: parseInt(item.quantity),
        })),
        reason: reason.trim(),
      });
      toast.success(t("orders.packageOrders.messages.itemsModified"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error modifying items:", error);
      toast.error(t("orders.packageOrders.messages.failedToModify"));
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
                  <TableHead className="w-24">{t("actions.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={`${item.product_id}-${item.sku_id}`}>
                    <TableCell>
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

        <div>
          <Label htmlFor="reason">
            {t("orders.packageOrders.modals.modifyItems.reason")} *
          </Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            placeholder={t(
              "orders.packageOrders.modals.modifyItems.reasonPlaceholder"
            )}
            rows={3}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </BaseModal>
  );
}
