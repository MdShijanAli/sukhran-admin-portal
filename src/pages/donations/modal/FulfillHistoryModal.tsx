import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import donationService from "@/services/donationService";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  DollarSign,
  Coins,
  TrendingUp,
  User,
  Mail,
  FileText,
  Calendar,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface FulfilledBy {
  id: number;
  name: string;
  email: string;
}

interface FulfillmentRecord {
  id: number;
  amount: number;
  notes: string;
  proof_document: string;
  fulfilled_by: FulfilledBy;
  fulfilled_at: string;
  created_at: string;
}

interface FulfillmentSummary {
  total_fulfilled: number;
  total_coin_donations: number;
  unfulfilled: number;
}

interface FulfillmentHistoryData {
  data: FulfillmentRecord[];
  meta: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
  summary: FulfillmentSummary;
}

interface FulfillHistoryModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  channelId: number | string | null;
}

const FulfillHistoryModal = ({
  open,
  onClose,
  channelId,
}: FulfillHistoryModalProps) => {
  const { t } = useTranslation();
  const [historyData, setHistoryData] = useState<FulfillmentHistoryData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!channelId || !open) return;
      setIsLoading(true);
      try {
        const response = await donationService.getFulfillmentHistory(
          channelId,
          `page=${currentPage}`,
        );
        const responseData = response as FulfillmentHistoryData;
        // console.log("Fulfillment History Data:", data);
        // console.log("Response Data:", responseData);
        setHistoryData(responseData);
      } catch (error) {
        console.error("Error fetching fulfillment history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [channelId, currentPage, open]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("donations.fulfillHistory.title")}
      showSubmitButton={false}
      closeButtonText={t("close")}
      size="3xl"
    >
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      ) : historyData ? (
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Fulfilled */}
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">
                    {t("donations.fulfillHistory.totalFulfilled")}
                  </p>
                  <p className="text-2xl  text-green-900 dark:text-green-100">
                    {formatCurrency(historyData?.summary?.total_fulfilled)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-700 dark:text-green-300" />
                </div>
              </div>
            </Card>

            {/* Total Coin Donations */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {t("donations.fulfillHistory.totalDonations")}
                  </p>
                  <p className="text-2xl  text-blue-900 dark:text-blue-100">
                    {formatCurrency(historyData?.summary?.total_coin_donations)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                </div>
              </div>
            </Card>

            {/* Unfulfilled */}
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-orange-700 dark:text-orange-300 mb-1">
                    {t("donations.fulfillHistory.unfulfilled")}
                  </p>
                  <p className="text-2xl  text-orange-900 dark:text-orange-100">
                    {formatCurrency(historyData?.summary?.unfulfilled)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-700 dark:text-orange-300" />
                </div>
              </div>
            </Card>
          </div>

          {/* Fulfillment History Records */}
          <div>
            <h4 className=" text-sm text-primary mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t("donations.fulfillHistory.records")}
            </h4>

            {historyData.data.length === 0 ? (
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {t("donations.fulfillHistory.noRecords")}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {historyData.data.map((record) => (
                  <Card
                    key={record.id}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-4">
                      {/* Header: Amount and ID */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl  text-primary">
                              {formatCurrency(record.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t("donations.fulfillHistory.recordId")}: #
                              {record.id}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {t("donations.fulfillHistory.fulfilled")}
                        </Badge>
                      </div>

                      {/* Fulfilled By */}
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs  text-muted-foreground mb-2 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {t("donations.fulfillHistory.fulfilledBy")}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="">
                              {record.fulfilled_by.name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {record.fulfilled_by.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {record.notes && (
                        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                          <p className="text-xs  text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {t("donations.fulfillHistory.notes")}
                          </p>
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            {record.notes}
                          </p>
                        </div>
                      )}

                      {/* Footer: Proof Document and Date */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(record.fulfilled_at)}
                          </div>
                        </div>
                        {record.proof_document && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(record.proof_document, "_blank")
                            }
                            className="gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            {t("donations.fulfillHistory.viewProof")}
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {historyData.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {t("pagination.previous")}
              </Button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: historyData.meta.last_page },
                  (_, i) => i + 1,
                ).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === historyData.meta.last_page}
              >
                {t("pagination.next")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {t("donations.fulfillHistory.noData")}
          </p>
        </Card>
      )}
    </BaseModal>
  );
};

export default FulfillHistoryModal;
