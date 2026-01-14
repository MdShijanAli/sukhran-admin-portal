import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Delivery } from "@/stores/deliveryStore";
import deliveryService from "@/services/deliveryService";

interface DeliveryFormData {
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  driver_id?: string;
  driver_name?: string;
  driver_phone?: string;
  status: Delivery["status"];
  scheduled_time: string;
  delivery_notes?: string;
  customer_notes?: string;
}

interface DeliveryFormModalProps {
  open: boolean;
  onClose: () => void;
  editData?: Delivery;
  onSuccess?: () => void;
}

export default function FormModal({
  open,
  onClose,
  editData,
  onSuccess,
}: DeliveryFormModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DeliveryFormData>({
    order_id: "",
    order_number: "",
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
    driver_id: "",
    driver_name: "",
    driver_phone: "",
    status: "pending",
    scheduled_time: "",
    delivery_notes: "",
    customer_notes: "",
  });

  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setFormData({
        order_id: editData.order_id?.toString() || "",
        order_number: editData.order_number || "",
        customer_name: editData.customer_name,
        customer_phone: editData.customer_phone,
        delivery_address: editData.delivery_address,
        driver_id: editData.driver_id?.toString() || "",
        driver_name: editData.driver_name || "",
        driver_phone: editData.driver_phone || "",
        status: editData.status,
        scheduled_time: editData.scheduled_time,
        delivery_notes: editData.delivery_notes || "",
        customer_notes: editData.customer_notes || "",
      });
    } else {
      setIsEditing(false);
      setFormData({
        order_id: "",
        order_number: "",
        customer_name: "",
        customer_phone: "",
        delivery_address: "",
        driver_id: "",
        driver_name: "",
        driver_phone: "",
        status: "pending",
        scheduled_time: "",
        delivery_notes: "",
        customer_notes: "",
      });
    }
  }, [editData, open]);

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.order_id ||
      !formData.customer_name ||
      !formData.customer_phone ||
      !formData.delivery_address ||
      !formData.scheduled_time
    ) {
      toast.error(t("delivery.messages.fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editData) {
        await deliveryService.updateItem(editData.id, formData);
        toast.success(t("delivery.messages.deliveryUpdated"));
      } else {
        await deliveryService.storeItem(formData);
        toast.success(t("delivery.messages.deliveryCreated"));
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        isEditing
          ? t("delivery.messages.failedToUpdate")
          : t("delivery.messages.failedToCreate")
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
        isEditing
          ? t("delivery.form.editDelivery")
          : t("delivery.form.createNewDelivery")
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        isEditing
          ? t("delivery.form.updateDelivery")
          : t("delivery.form.createDelivery")
      }
      size="2xl"
    >
      <div className="grid gap-4">
        {/* Order Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold border-b pb-2">
            {t("delivery.form.orderInfo")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order_id">
                {t("delivery.form.orderId")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="order_id"
                value={formData.order_id}
                onChange={(e) =>
                  setFormData({ ...formData, order_id: e.target.value })
                }
                placeholder={t("delivery.form.orderIdPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order_number">
                {t("delivery.form.orderNumber")}
              </Label>
              <Input
                id="order_number"
                value={formData.order_number}
                onChange={(e) =>
                  setFormData({ ...formData, order_number: e.target.value })
                }
                placeholder="ORD-2024-001"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold border-b pb-2">
            {t("delivery.form.customerInfo")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">
                {t("delivery.form.customerName")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                placeholder={t("delivery.form.customerNamePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_phone">
                {t("delivery.form.customerPhone")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone}
                onChange={(e) =>
                  setFormData({ ...formData, customer_phone: e.target.value })
                }
                placeholder={t("delivery.form.customerPhonePlaceholder")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_address">
              {t("delivery.form.deliveryAddress")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="delivery_address"
              value={formData.delivery_address}
              onChange={(e) =>
                setFormData({ ...formData, delivery_address: e.target.value })
              }
              placeholder={t("delivery.form.deliveryAddressPlaceholder")}
              rows={2}
            />
          </div>
        </div>

        {/* Driver Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold border-b pb-2">
            {t("delivery.form.driverInfo")}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driver_name">
                {t("delivery.form.driverName")}
              </Label>
              <Input
                id="driver_name"
                value={formData.driver_name}
                onChange={(e) =>
                  setFormData({ ...formData, driver_name: e.target.value })
                }
                placeholder={t("delivery.form.selectDriver")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver_phone">
                {t("delivery.form.driverPhone")}
              </Label>
              <Input
                id="driver_phone"
                value={formData.driver_phone}
                onChange={(e) =>
                  setFormData({ ...formData, driver_phone: e.target.value })
                }
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled_time">
                {t("delivery.form.scheduledTime")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="scheduled_time"
                type="datetime-local"
                value={formData.scheduled_time}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_time: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">
                {t("delivery.form.deliveryStatus")}
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Delivery["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    {t("delivery.status.pending")}
                  </SelectItem>
                  <SelectItem value="assigned">
                    {t("delivery.status.assigned")}
                  </SelectItem>
                  <SelectItem value="picked-up">
                    {t("delivery.status.pickedUp")}
                  </SelectItem>
                  <SelectItem value="in-transit">
                    {t("delivery.status.inTransit")}
                  </SelectItem>
                  <SelectItem value="delivered">
                    {t("delivery.status.delivered")}
                  </SelectItem>
                  <SelectItem value="failed">
                    {t("delivery.status.failed")}
                  </SelectItem>
                  <SelectItem value="cancelled">
                    {t("delivery.status.cancelled")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_notes">
              {t("delivery.form.deliveryNotes")}
            </Label>
            <Textarea
              id="delivery_notes"
              value={formData.delivery_notes}
              onChange={(e) =>
                setFormData({ ...formData, delivery_notes: e.target.value })
              }
              placeholder={t("delivery.form.deliveryNotesPlaceholder")}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_notes">
              {t("delivery.form.customerNotes")}
            </Label>
            <Textarea
              id="customer_notes"
              value={formData.customer_notes}
              onChange={(e) =>
                setFormData({ ...formData, customer_notes: e.target.value })
              }
              placeholder={t("delivery.form.customerNotesPlaceholder")}
              rows={2}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
