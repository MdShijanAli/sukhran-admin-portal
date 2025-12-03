import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Coupon } from "@/lib/types";
import couponService from "@/services/couponService";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Percent,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { BaseModal } from "@/components/modals";
import TimeStaps from "@/components/custom/TimeStamps";

interface ApiResponse {
  data: Coupon;
}

interface CouponViewModalProps {
  open: boolean;
  onClose: () => void;
  couponId: number | null;
}

export default function ViewModal({
  open,
  onClose,
  couponId,
}: CouponViewModalProps) {
  const { t } = useTranslation();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCouponDetails = async () => {
      if (!couponId || !open) return;

      setIsLoading(true);
      try {
        const response = await couponService.fetchDetails(couponId);
        const apiResponse = response as unknown as ApiResponse;
        setCoupon(apiResponse.data || (response as Coupon));
      } catch (error) {
        console.error("Failed to fetch coupon details:", error);
        toast.error(t("coupon.messages.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCouponDetails();
  }, [couponId, open, t]);

  const getStatusBadge = () => {
    if (!coupon) return null;

    if (!coupon.isActive) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          {t("coupon.status.inactive")}
        </Badge>
      );
    }

    if (coupon.validity.is_expired) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {t("coupon.status.expired")}
        </Badge>
      );
    }

    if (coupon.validity.is_upcoming) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {t("coupon.status.upcoming")}
        </Badge>
      );
    }

    if (coupon.validity.is_valid_now) {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {t("coupon.status.active")}
        </Badge>
      );
    }

    return null;
  };

  const getUsagePercentage = () => {
    if (!coupon) return 0;
    const total = parseInt(coupon.usage.limit_total);
    const used = parseInt(coupon.usage.count);
    return total > 0 ? (used / total) * 100 : 0;
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("coupon.view.couponDetails")}
      size="3xl"
      showSubmitButton={false}
      loading={isLoading}
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">{coupon?.code}</h3>
                {getStatusBadge()}
              </div>
              <p className="text-lg text-muted-foreground">{coupon?.name}</p>
              {coupon?.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {coupon.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {coupon?.discount.formatted}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Discount Information */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            {coupon?.discount.type === "percentage" ? (
              <Percent className="h-4 w-4" />
            ) : (
              <DollarSign className="h-4 w-4" />
            )}
            {t("coupon.view.discountInformation")}
          </h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground mb-1">
                {t("coupon.view.discountType")}
              </p>
              <p className="font-semibold capitalize">
                {coupon?.discount.type === "percentage"
                  ? t("coupon.form.percentage")
                  : t("coupon.form.fixed")}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground mb-1">
                {t("coupon.view.discountValue")}
              </p>
              <p className="font-semibold">
                {coupon?.discount.type === "percentage"
                  ? `${coupon.discount.value}%`
                  : `৳${coupon?.discount.value.toFixed(2)}`}
              </p>
            </div>
            {coupon?.discount.max_amount && (
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("coupon.view.maxDiscount")}
                </p>
                <p className="font-semibold">
                  ৳{coupon.discount.max_amount.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Order Requirements */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            {t("coupon.view.orderRequirements")}
          </h4>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground mb-1">
              {t("coupon.view.minOrderAmount")}
            </p>
            <p className="text-xl font-semibold">
              ৳{coupon?.min_order_amount.toFixed(2)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Validity Period */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("coupon.view.validityPeriod")}
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t("coupon.view.validFrom")}
              </p>
              <p className="font-medium">{coupon?.validity.from}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t("coupon.view.validTo")}
              </p>
              <p className="font-medium">{coupon?.validity.to}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Usage Statistics */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("coupon.view.usageStatistics")}
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  {t("coupon.view.totalUsage")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getUsagePercentage().toFixed(1)}%
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">
                    {coupon?.usage.count} / {coupon?.usage.limit_total}
                  </p>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${getUsagePercentage()}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("coupon.view.remaining")}: {coupon?.usage.remaining}
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground mb-1">
                {t("coupon.view.limitPerUser")}
              </p>
              <p className="text-2xl font-bold">
                {coupon?.usage.limit_per_user}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {t("coupon.view.limitPerUserHelp")}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Discount Given */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t("coupon.view.totalDiscountGiven")}
          </h4>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-3xl font-bold text-primary">
              ৳{coupon?.usage.total_discount_given.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("coupon.view.totalDiscountHelp")}
            </p>
          </div>
        </div>

        <Separator />

        {/* Created/Updated Information */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t("coupon.view.createdBy")}
              </p>
              <p className="font-medium">{coupon?.created_by}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t("coupon.view.updatedBy")}
              </p>
              <p className="font-medium">{coupon?.updated_by}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timestamps */}
        <TimeStaps item={coupon} />
      </div>
    </BaseModal>
  );
}
