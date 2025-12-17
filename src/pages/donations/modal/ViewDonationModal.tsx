import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Donation } from "@/lib/types";
import donationService from "@/services/donationService";
import { formatCurrency, formatDate } from "@/lib/utils";

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
          {/* Donor Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3">
              {t("donations.donations.view.donorInfo")}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("donations.donations.view.name")}
                </p>
                <p className="font-medium">
                  {donation.donor.isAnonymous
                    ? t("donations.donations.view.anonymous")
                    : donation.donor.name}
                </p>
              </div>
              {!donation.donor.isAnonymous && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("donations.donations.view.email")}
                    </p>
                    <p className="font-medium">{donation.donor.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("donations.donations.view.mobile")}
                    </p>
                    <p className="font-medium">{donation.donor.mobile}</p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Channel Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3">
              {t("donations.donations.view.channelInfo")}
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("donations.donations.view.channelName")}
                </p>
                <p className="font-medium">{donation.channel.name}</p>
              </div>
              {donation.channel.description && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("donations.donations.view.channelDescription")}
                  </p>
                  <p className="text-sm">{donation.channel.description}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3">
              {t("donations.donations.view.paymentInfo")}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("donations.donations.view.amount")}
                </p>
                <p className="font-bold text-lg">
                  {formatCurrency(donation.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("donations.donations.view.type")}
                </p>
                {getTypeBadge(donation.donationType)}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("donations.donations.view.paymentMethod")}
                </p>
                {getPaymentMethodBadge(donation.paymentMethod)}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("donations.donations.view.paymentStatus")}
                </p>
                {getStatusBadge(donation.paymentStatus)}
              </div>
              {donation.transactionId && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">
                    {t("donations.donations.view.transactionId")}
                  </p>
                  <p className="font-mono text-sm">{donation.transactionId}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-4">
            <h4 className="font-semibold text-sm text-primary mb-3">
              {t("donations.donations.view.additionalInfo")}
            </h4>
            <div className="space-y-3">
              {donation.donorMessage && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("donations.donations.view.donorMessage")}
                  </p>
                  <p className="text-sm italic">"{donation.donorMessage}"</p>
                </div>
              )}
              {donation.orderId && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("donations.donations.view.orderId")}
                  </p>
                  <p className="font-medium">{donation.orderId}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("donations.donations.view.donatedAt")}
                  </p>
                  <p className="font-medium">
                    {formatDate(donation.donatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("donations.donations.view.createdAt")}
                  </p>
                  <p className="font-medium">
                    {formatDate(donation.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </BaseModal>
  );
}
