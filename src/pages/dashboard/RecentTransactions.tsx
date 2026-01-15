import { BaseTable, Column } from "@/components/table";
import { RecentTransactionsData } from "./Dashboard";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { StatusVariant } from "@/lib/utils";

export default function RecentTransactions({
  data,
  isLoading = false,
}: {
  data: RecentTransactionsData[];
  isLoading?: boolean;
}) {
  const columns = useMemo<Column<RecentTransactionsData>[]>(() => {
    return [
      {
        key: "transaction_id",
        label: "Transaction ID",
        render: (item) => item.transaction_id,
      },
      {
        key: "name",
        label: "Customer Name",
        render: (item) => item.customer.name,
      },
      {
        key: "amount",
        label: "Amount",
        render: (item) => `৳${item.amount.toFixed(2)}`,
      },
      {
        key: "payment_method",
        label: "Payment Method",
        render: (item) => (
          <Badge className={StatusVariant(item.payment_method)}>
            {item.payment_method.charAt(0).toUpperCase() +
              item.payment_method.slice(1)}
          </Badge>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (item) => (
          <Badge className={StatusVariant(item.status)}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        ),
      },
      {
        key: "type",
        label: "Type",
        render: (item) => (
          <Badge variant={`${item.type === "Regular" ? "primary" : "outline"}`}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Badge>
        ),
      },
      {
        key: "created_at",
        label: "Date",
        className: "w-[100px]",
      },
    ];
  }, []);
  return (
    <div>
      <BaseTable
        columns={columns}
        data={data?.slice(0, 10) || []}
        isLoading={isLoading}
        getRowKey={(item) => item.transaction_id}
        rowClassName={() =>
          "hover:bg-primary/5 transition-colors w-[1500px] overflow-x-auto"
        }
      />
    </div>
  );
}
