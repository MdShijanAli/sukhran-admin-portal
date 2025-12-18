import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Donation } from "@/lib/types";
import donationService from "@/services/donationService";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShoppingBag,
  Calendar,
  MessageSquare,
  Receipt,
  DollarSign,
} from "lucide-react";
import TimeStaps from "@/components/custom/TimeStamps";

interface ViewDonationModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  donationId: number | string | null;
}

export default function ViewDonationModal({
  open,
  onClose,
  donationId,
}: ViewDonationModalProps) {
  const { t } = useTranslation();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      if (!donationId || !open) return;
      setIsLoading(true);
      try {
        const response = await donationService.fetchDetails(donationId);
        const responseData = response as unknown as Record<string, unknown>;
        const donationData =
          (responseData?.data as Donation) || (response as unknown as Donation);
        setDonation(donationData);
      } catch (error) {
        console.error("Error fetching donation details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonationDetails();
  }, [donationId, open]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      paid: "default",
      pending: "secondary",
      failed: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {t(`donations.donations.status.${status}`)}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    return (
      <Badge variant="outline">
        {t(`donations.donations.paymentMethod.${method}`)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline">{t(`donations.donations.type.${type}`)}</Badge>
    );
  };

  if (!donation && !isLoading) return null;

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("donations.donations.view.title")}
      showSubmitButton={false}
      closeButtonText={t("close")}
      size="2xl"
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : donation ? (
        <div className="space-y-4">
          {/* Donation Amount Highlight */}
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("donations.donations.view.amount")}
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(donation.amount)}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              {getTypeBadge(donation.donationType)}
              {getPaymentMethodBadge(donation.paymentMethod)}
              {getStatusBadge(donation.paymentStatus)}
            </div>
          </Card>

          {/* Donor Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("donations.donations.view.donorInfo")}
            </h4>
            {donation.donor.isAnonymous ? (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-lg">
                    {t("donations.donations.view.anonymous")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Identity protected
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {donation.donor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Donor</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 border rounded-lg">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium truncate">
                        {donation.donor.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded-lg">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Mobile</p>
                      <p className="text-sm font-medium">
                        {donation.donor.mobile}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Channel Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t("donations.donations.view.channelInfo")}
            </h4>
            <div className="p-3 border rounded-lg bg-muted/30">
              <p className="font-semibold text-lg mb-1">
                {donation.channel.name}
              </p>
              {donation.channel.description && (
                <p className="text-sm text-muted-foreground">
                  {donation.channel.description}
                </p>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Payment Information */}
            <Card className="p-4">
              <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                {t("donations.donations.view.paymentInfo")}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">
                    {t("donations.donations.view.paymentMethod")}
                  </span>
                  {getPaymentMethodBadge(donation.paymentMethod)}
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">
                    {t("donations.donations.view.paymentStatus")}
                  </span>
                  {getStatusBadge(donation.paymentStatus)}
                </div>
                {donation.transactionId && (
                  <div className="p-2 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("donations.donations.view.transactionId")}
                    </p>
                    <p className="font-mono text-sm font-medium">
                      {donation.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Order Information */}
            {donation.order && (
              <Card className="p-4">
                <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Order Information
                </h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <p className="text-xs text-muted-foreground mb-1">
                      Order ID
                    </p>
                    <p className="font-mono text-sm font-bold text-blue-600">
                      {donation.order.orderId}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted/30 rounded">
                      <p className="text-xs text-muted-foreground mb-1">
                        Order Type
                      </p>
                      <Badge variant="outline" className="capitalize">
                        {donation.order.orderType}
                      </Badge>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <p className="text-xs text-muted-foreground mb-1">
                        Grand Total
                      </p>
                      <p className="font-bold text-sm">
                        {formatCurrency(donation.order.grandTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Additional Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t("donations.donations.view.additionalInfo")}
            </h4>
            <div className="space-y-3">
              {donation.donorMessage && (
                <div className="p-3 border rounded-lg bg-amber-50 dark:bg-amber-950">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-amber-600 mt-0.5" />
                    <p className="text-xs font-semibold text-amber-600">
                      {t("donations.donations.view.donorMessage")}
                    </p>
                  </div>
                  <p className="text-sm italic pl-6">
                    "{donation.donorMessage}"
                  </p>
                </div>
              )}
              <TimeStaps item={donation} />
            </div>
          </Card>
        </div>
      ) : null}
    </BaseModal>
  );
}
