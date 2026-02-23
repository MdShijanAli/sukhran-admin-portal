import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CoinTransaction, UserCoinDetails } from "@/lib/types";
import { Coins, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatNumberWithCommas } from "@/lib/utils";
import coinService from "@/services/coinService";
import defaultUserImage from "@/assets/images/avatar-ractangle.jpg";
import { BaseTable, Column } from "@/components/table";

interface UserCoinDetailsModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export default function UserCoinDetailsModal({
  open,
  onClose,
  userId,
}: UserCoinDetailsModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<UserCoinDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const fetchUserDetails = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: perPage.toString(),
        }).toString();
        const response = await coinService.fetchUserCoinDetails(userId, params);
        setDetails(response);
        setCurrentPage(page);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(
          error.response?.data?.message ||
          t("coinManagement.userDetails.error"),
        );
      } finally {
        setLoading(false);
      }
    },
    [userId, t, perPage],
  );

  useEffect(() => {
    if (open && userId) {
      fetchUserDetails();
    }
  }, [open, userId, perPage]);

  const handlePageChange = (page: number) => {
    fetchUserDetails(page);
  };

  const columns: Column<CoinTransaction>[] = [
    {
      key: "sl",
      label: t("coinManagement.transactions.columns.sl"),
      render: (_, index) => <> {(currentPage - 1) * perPage + index + 1}</>,
      className: "text-center w-16",
    },
    {
      key: "type",
      label: t("coinManagement.userDetails.type"),
      render: (transaction) => (
        <Badge
          variant={
            transaction.type === "earned"
              ? "default"
              : "secondary"
          }
        >
          {t(
            `coinManagement.transactions.types.${transaction.type}`,
          )}
        </Badge>
      ),
      className: "w-20",
    },
    {
      key: "amount",
      label: t("coinManagement.userDetails.amount"),
      render: (transaction) => (
        <span
          className={` ${transaction.type === "earned"
            ? "text-green-600"
            : "text-red-600"
            }`}
        >
          {transaction.type === "earned" ? "+" : "-"}
          {formatNumberWithCommas(transaction.amount)}
        </span>
      ),
    },
    {
      key: "reason",
      label: t("coinManagement.userDetails.reason"),
      className: "text-center",
    },
    {
      key: "description",
      label: t("coinManagement.userDetails.description"),
      className: "w-[300px]"
    },
    {
      key: "balanceAfter",
      label: t("coinManagement.userDetails.balanceAfter"),
      render: (transaction) => (
        <span> {formatNumberWithCommas(
          transaction.balance_after,
        )}</span>
      ),
    },
    {
      key: "date",
      label: t("coinManagement.userDetails.date"),
      render: (transaction) => (
        <div className="w-[100px]">
          {new Date(
            transaction.created_at,
          ).toLocaleString()}
        </div>
      ),
    },
  ];

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("coinManagement.userDetails.title")}
      showSubmitButton={false}
      closeButtonText={t("coinManagement.userDetails.close")}
      size="4xl"
    >
      <div className="space-y-3">
        {loading && !details ? (
          <div className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : details ? (
          <>
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("coinManagement.userDetails.userInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("coinManagement.userDetails.name")}
                      </p>
                      <p className="font-medium">{details.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("coinManagement.userDetails.email")}
                      </p>
                      <p className="font-medium text-sm">
                        {details.user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("coinManagement.userDetails.mobile")}
                      </p>
                      <p className="font-medium">{details.user.mobile}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <img
                      src={details.user.image_url || defaultUserImage}
                      alt={details.user.name}
                      className="w-40 h-40 rounded-lg object-cover border"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Balance Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("coinManagement.userDetails.balance")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                    <Coins className="h-6 w-6 text-amber-600 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t("coinManagement.userDetails.totalCoins")}
                    </p>
                    <p className="text-2xl  text-amber-600">
                      {formatNumberWithCommas(details.balance.total_coins)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <Wallet className="h-6 w-6 text-red-600 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t("coinManagement.userDetails.lockedCoins")}
                    </p>
                    <p className="text-2xl  text-red-600">
                      {formatNumberWithCommas(details.balance.locked_coins)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <Coins className="h-6 w-6 text-green-600 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t("coinManagement.userDetails.availableCoins")}
                    </p>
                    <p className="text-2xl  text-green-600">
                      {formatNumberWithCommas(details.balance.available_coins)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("coinManagement.userDetails.statistics")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("coinManagement.userDetails.totalEarned")}
                      </p>
                      <p className="text-lg  text-green-600">
                        +
                        {formatNumberWithCommas(
                          details.statistics.total_earned,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("coinManagement.userDetails.totalSpent")}
                      </p>
                      <p className="text-lg  text-red-600">
                        -
                        {formatNumberWithCommas(details.statistics.total_spent)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Coins className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("coinManagement.userDetails.netCoins")}
                      </p>
                      <p className="text-lg  text-blue-600">
                        {formatNumberWithCommas(details.statistics.net_coins)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("coinManagement.userDetails.transactionHistory")}
                </CardTitle>
                <CardDescription>
                  {details.pagination.total}{" "}
                  {t("coinManagement.userDetails.noTransactions")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <BaseTable
                    columns={columns}
                    data={details.transactions}
                    isLoading={loading}
                    getRowKey={(item) => item.id.toString()}
                    emptyMessage={t(
                      "coinManagement.userDetails.noTransactions",
                    )}
                  />
                </div>

                {/* Pagination */}
                {details.pagination.last_page > 1 && (
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * perPage + 1} to{" "}
                      {Math.min(currentPage * perPage, details.pagination.total)} of{" "}
                      {details.pagination.total} results
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage === details.pagination.last_page ||
                          loading
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </BaseModal>
  );
}
