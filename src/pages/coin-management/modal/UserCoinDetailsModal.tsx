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
import { UserCoinDetails } from "@/lib/types";
import { Coins, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatNumberWithCommas } from "@/lib/utils";
import coinService from "@/services/coinService";
import defaultUserImage from "@/assets/images/avatar-ractangle.jpg";

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

  const fetchUserDetails = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "10",
        }).toString();
        const response = await coinService.fetchUserCoinDetails(userId, params);
        setDetails(response);
        setCurrentPage(page);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(
          error.response?.data?.message || t("coinManagement.userDetails.error")
        );
      } finally {
        setLoading(false);
      }
    },
    [userId, t]
  );

  useEffect(() => {
    if (open && userId) {
      fetchUserDetails();
    }
  }, [open, userId, fetchUserDetails]);

  const handlePageChange = (page: number) => {
    fetchUserDetails(page);
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("coinManagement.userDetails.title")}
      showSubmitButton={false}
      closeButtonText={t("coinManagement.userDetails.close")}
      size="2xl"
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
                      src={details.user.image || defaultUserImage}
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
                    <p className="text-2xl font-bold text-amber-600">
                      {formatNumberWithCommas(details.balance.total_coins)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <Wallet className="h-6 w-6 text-red-600 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t("coinManagement.userDetails.lockedCoins")}
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatNumberWithCommas(details.balance.locked_coins)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <Coins className="h-6 w-6 text-green-600 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t("coinManagement.userDetails.availableCoins")}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
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
                      <p className="text-lg font-semibold text-green-600">
                        +
                        {formatNumberWithCommas(
                          details.statistics.total_earned
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
                      <p className="text-lg font-semibold text-red-600">
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
                      <p className="text-lg font-semibold text-blue-600">
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">
                          {t("coinManagement.transactions.columns.sl")}
                        </TableHead>
                        <TableHead>
                          {t("coinManagement.userDetails.type")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("coinManagement.userDetails.amount")}
                        </TableHead>
                        <TableHead>
                          {t("coinManagement.userDetails.reason")}
                        </TableHead>
                        <TableHead>
                          {t("coinManagement.userDetails.description")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("coinManagement.userDetails.balanceAfter")}
                        </TableHead>
                        <TableHead>
                          {t("coinManagement.userDetails.date")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell colSpan={7}>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : details.transactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            {t("coinManagement.userDetails.noTransactions")}
                          </TableCell>
                        </TableRow>
                      ) : (
                        details.transactions.map((transaction, index) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="text-center">
                              {(currentPage - 1) * 10 + index + 1}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  transaction.type === "earned"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {t(
                                  `coinManagement.transactions.types.${transaction.type}`
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`font-bold ${
                                  transaction.type === "earned"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.type === "earned" ? "+" : "-"}
                                {formatNumberWithCommas(transaction.amount)}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">
                              {transaction.reason || "N/A"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                              {transaction.description}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatNumberWithCommas(
                                transaction.balance_after
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(
                                transaction.created_at
                              ).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {details.pagination.last_page > 1 && (
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * 10 + 1} to{" "}
                      {Math.min(currentPage * 10, details.pagination.total)} of{" "}
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
