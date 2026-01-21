import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Coupon, CouponFormData } from "@/lib/types";
import couponService from "@/services/couponService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { BaseModal } from "@/components/modals";

interface CouponFormModalProps {
  open: boolean;
  onClose: () => void;
  editData?: Coupon;
  onRefresh?: () => void;
}

export default function FormModal({
  open,
  onClose,
  editData,
  onRefresh,
}: CouponFormModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    name: "",
    discount_type: "percentage",
    description: "",
    discount_value: 0,
    min_order_amount: 0,
    valid_from: "",
    valid_to: "",
    usage_limit_total: 100,
    usage_limit_per_user: 1,
    isActive: true,
  });

  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setFormData({
        code: editData.code,
        name: editData.name,
        discount_type: editData.discount.type,
        description: editData.description || "",
        discount_value: editData.discount.value,
        min_order_amount: editData.min_order_amount,
        valid_from: editData.validity.from,
        valid_to: editData.validity.to,
        usage_limit_total: parseInt(editData.usage.limit_total),
        usage_limit_per_user: parseInt(editData.usage.limit_per_user),
        isActive: editData.isActive,
      });
    } else {
      setIsEditing(false);
      setFormData({
        code: "",
        name: "",
        discount_type: "percentage",
        description: "",
        discount_value: 0,
        min_order_amount: 0,
        valid_from: "",
        valid_to: "",
        usage_limit_total: 100,
        usage_limit_per_user: 1,
        isActive: true,
      });
    }
  }, [editData, open]);

  const updateField = (
    field: keyof CouponFormData,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.code || formData.code.length < 3) {
      toast.error(t("coupon.messages.codeTooShort"));
      return;
    }
    if (!formData.name || formData.name.length < 3) {
      toast.error(t("coupon.messages.nameTooShort"));
      return;
    }
    if (formData.discount_value <= 0) {
      toast.error(t("coupon.messages.invalidDiscountValue"));
      return;
    }
    if (
      formData.discount_type === "percentage" &&
      formData.discount_value > 100
    ) {
      toast.error(t("coupon.messages.percentageExceeds"));
      return;
    }
    if (formData.min_order_amount < 0) {
      toast.error(t("coupon.messages.invalidMinOrder"));
      return;
    }
    if (!formData.valid_from || !formData.valid_to) {
      toast.error(t("coupon.messages.datesRequired"));
      return;
    }
    if (new Date(formData.valid_from) >= new Date(formData.valid_to)) {
      toast.error(t("coupon.messages.invalidDateRange"));
      return;
    }
    if (formData.usage_limit_total <= 0) {
      toast.error(t("coupon.messages.invalidUsageLimit"));
      return;
    }
    if (formData.usage_limit_per_user <= 0) {
      toast.error(t("coupon.messages.invalidPerUserLimit"));
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSubmit: Partial<CouponFormData> = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        min_order_amount: formData.min_order_amount,
        valid_from: formData.valid_from,
        valid_to: formData.valid_to,
        usage_limit_total: formData.usage_limit_total,
        usage_limit_per_user: formData.usage_limit_per_user,
        isActive: formData.isActive,
      };

      // Add optional fields
      if (formData.description) {
        dataToSubmit.description = formData.description;
      }

      console.log("Submitting coupon data:", dataToSubmit);

      const result = isEditing
        ? await couponService.updateCoupon(editData!.id, dataToSubmit)
        : await couponService.storeItem(dataToSubmit);

      console.log("Result:", result);
      toast.success(
        isEditing
          ? t("coupon.messages.couponUpdated")
          : t("coupon.messages.couponCreated"),
      );

      const resultData = result as { status?: number; success?: boolean };
      if (resultData.status === 200 || resultData.success === true) {
        onRefresh?.();
      }
      onClose();
    } catch (error) {
      console.error("Error submitting coupon:", error);
      toast.error(
        error.response.data.error_message || t("coupon.messages.submitError"),
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
          ? t("coupon.form.editCoupon")
          : t("coupon.form.createNewCoupon")
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={
        isEditing
          ? t("coupon.form.updateCoupon")
          : t("coupon.form.createCoupon")
      }
      size="3xl"
    >
      <div className="grid gap-6">
        {/* Coupon Code and Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">
              {t("coupon.form.code")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                updateField("code", e.target.value.toUpperCase())
              }
              placeholder={t("coupon.form.codePlaceholder")}
              className="uppercase"
              disabled={isEditing}
            />
            <p className="text-xs text-muted-foreground">
              {t("coupon.form.codeHelp")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("coupon.form.name")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={t("coupon.form.namePlaceholder")}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t("coupon.form.description")}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder={t("coupon.form.descriptionPlaceholder")}
            rows={2}
          />
        </div>

        {/* Discount Type and Value */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="discount_type">
              {t("coupon.form.discountType")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.discount_type}
              onValueChange={(value: "percentage" | "fixed") =>
                updateField("discount_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">
                  {t("coupon.form.percentage")}
                </SelectItem>
                <SelectItem value="fixed">{t("coupon.form.fixed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount_value">
              {t("coupon.form.discountValue")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="discount_value"
              type="number"
              step={formData.discount_type === "percentage" ? "1" : "0.01"}
              value={formData.discount_value}
              onChange={(e) =>
                updateField("discount_value", parseFloat(e.target.value) || 0)
              }
              placeholder={
                formData.discount_type === "percentage" ? "10" : "100"
              }
            />
          </div>
          {/* Minimum Order Amount */}
          <div className="space-y-2">
            <Label htmlFor="min_order_amount">
              {t("coupon.form.minOrderAmount")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="min_order_amount"
              type="number"
              step="0.01"
              value={formData.min_order_amount}
              onChange={(e) =>
                updateField("min_order_amount", parseFloat(e.target.value) || 0)
              }
              placeholder="100"
            />
            <p className="text-xs text-muted-foreground">
              {t("coupon.form.minOrderHelp")}
            </p>
          </div>
        </div>

        {/* Validity Period */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("coupon.form.validityPeriod")}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="valid_from"
                className="text-sm text-muted-foreground"
              >
                {t("coupon.form.validFrom")}
              </Label>
              <Input
                id="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => updateField("valid_from", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="valid_to"
                className="text-sm text-muted-foreground"
              >
                {t("coupon.form.validTo")}
              </Label>
              <Input
                id="valid_to"
                type="date"
                value={formData.valid_to}
                onChange={(e) => updateField("valid_to", e.target.value)}
                min={formData.valid_from}
              />
            </div>
          </div>
        </div>

        {/* Usage Limits */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="usage_limit_total">
              {t("coupon.form.usageLimitTotal")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="usage_limit_total"
              type="number"
              value={formData.usage_limit_total}
              onChange={(e) =>
                updateField("usage_limit_total", parseInt(e.target.value) || 0)
              }
              placeholder="100"
            />
            <p className="text-xs text-muted-foreground">
              {t("coupon.form.usageLimitTotalHelp")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="usage_limit_per_user">
              {t("coupon.form.usageLimitPerUser")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="usage_limit_per_user"
              type="number"
              value={formData.usage_limit_per_user}
              onChange={(e) =>
                updateField(
                  "usage_limit_per_user",
                  parseInt(e.target.value) || 0,
                )
              }
              placeholder="1"
            />
            <p className="text-xs text-muted-foreground">
              {t("coupon.form.usageLimitPerUserHelp")}
            </p>
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2 rounded-lg border p-4">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => updateField("isActive", checked)}
          />
          <div className="flex-1">
            <Label htmlFor="isActive" className="cursor-pointer font-medium">
              {t("coupon.form.activeStatus")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("coupon.form.activeStatusHelp")}
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
