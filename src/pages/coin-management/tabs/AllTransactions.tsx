import { useTranslation } from "react-i18next";
import { Column } from "@/components/table/BaseTable";
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
import { CoinTransaction, PaginationMeta } from "@/lib/types";
import { formatNumberWithCommas } from "@/lib/utils";
import getSerialNumber from "@/lib/getSerialNumber";
import { useCoinStore } from "@/stores/coinStore";

interface AllTransactionsProps {
  transactions: CoinTransaction[];
  isLoading: boolean;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function AllTransactions({
  transactions,
  isLoading,
  pagination,
  onPageChange,
}: AllTransactionsProps) {
  const { t } = useTranslation();
  const store = useCoinStore();

  const columns: Column<CoinTransaction>[] = [
    {
      key: "sl",
      label: t("coinManagement.transactions.columns.sl"),
      render: (_, index) => getSerialNumber(store, index),
      className: "text-center w-16",
    },
    {
      key: "id",
      label: t("coinManagement.transactions.columns.id"),
      render: (transaction) => (
        <span className="font-mono">#{transaction.id}</span>
      ),
      className: "w-20",
    },
    {
      key: "user",
      label: t("coinManagement.transactions.columns.user"),
      render: (transaction) => (
        <div>
          <p className="font-medium">{transaction.user.name}</p>
          <p className="text-xs text-muted-foreground">
            {transaction.user.email}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      label: t("coinManagement.transactions.columns.type"),
      render: (transaction) => (
        <Badge
          variant={transaction.type === "earned" ? "default" : "secondary"}
        >
          {t(`coinManagement.transactions.types.${transaction.type}`)}
        </Badge>
      ),
      className: "text-center",
    },
    {
      key: "amount",
      label: t("coinManagement.transactions.columns.amount"),
      render: (transaction) => (
        <span
          className={` ${
            transaction.type === "earned" ? "text-green-600" : "text-red-600"
          }`}
        >
          {transaction.type === "earned" ? "+" : "-"}
          {formatNumberWithCommas(transaction.amount)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "reason",
      label: t("coinManagement.transactions.columns.reason"),
      render: (transaction) => (
        <span className="text-sm">{transaction.reason || "N/A"}</span>
      ),
    },
    {
      key: "description",
      label: t("coinManagement.transactions.columns.description"),
      render: (transaction) => (
        <span className="text-sm text-muted-foreground line-clamp-2">
          {transaction.description}
        </span>
      ),
    },
    {
      key: "balance_after",
      label: t("coinManagement.transactions.columns.balanceAfter"),
      render: (transaction) => (
        <span className="font-medium">
          {formatNumberWithCommas(transaction.balance_after)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "created_at",
      label: t("coinManagement.transactions.columns.date"),
      render: (transaction) => (
        <span className="text-sm">
          {new Date(transaction.created_at).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("coinManagement.transactions.title")}</CardTitle>
        <CardDescription>
          {t("coinManagement.transactions.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index} className={column.className}>
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("coinManagement.transactions.noTransactions")}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction, index) => (
                  <TableRow key={transaction.id}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className={column.className}>
                        {column.render
                          ? column.render(transaction, index)
                          : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {pagination.from} to {pagination.to} of {pagination.total}{" "}
              results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
