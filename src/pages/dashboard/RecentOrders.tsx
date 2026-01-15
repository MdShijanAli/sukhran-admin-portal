import { BaseTable, Column } from "@/components/table";
import { RecentOrdersData } from "./Dashboard";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import constData from "@/lib/constData";
import { StatusVariant } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function RecentOrders({
  data,
  isLoading = false,
}: {
  data: RecentOrdersData[];
  isLoading?: boolean;
}) {
  const { t } = useTranslation();
  const columns = useMemo<Column<RecentOrdersData>[]>(() => {
    return [
      {
        key: "orderId",
        label: t("dashboard.recentOrders.orderId"),
        render: (item) => item.orderId,
      },
      {
        key: "name",
        label: t("dashboard.recentOrders.customerName"),
        render: (item) => item.customer.name,
      },
      {
        key: "amount",
        label: t("dashboard.recentOrders.amount"),
        render: (item) => `৳${item.amount.toFixed(2)}`,
      },
      {
        key: "payment_mode",
        label: t("dashboard.recentOrders.paymentMethod"),
        render: (item) => (
          <Badge className={StatusVariant(item.payment_mode)}>
            {item.payment_mode.charAt(0).toUpperCase() +
              item.payment_mode.slice(1)}
          </Badge>
        ),
      },
      {
        key: "payment_status",
        label: t("dashboard.recentOrders.paymentStatus"),
        render: (item) => (
          <Badge className={StatusVariant(item.payment_status)}>
            {item.payment_status.charAt(0).toUpperCase() +
              item.payment_status.slice(1)}
          </Badge>
        ),
      },
      {
        key: "order_status",
        label: t("dashboard.recentOrders.orderStatus"),
        render: (item) => (
          <Badge className={StatusVariant(item.order_status)}>
            {item.order_status.charAt(0).toUpperCase() +
              item.order_status.slice(1)}
          </Badge>
        ),
      },
      {
        key: "type",
        label: t("dashboard.recentOrders.type"),
        render: (item) => (
          <Badge variant={`${item.type === "Package" ? "primary" : "outline"}`}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Badge>
        ),
      },
      {
        key: "created_at",
        label: t("dashboard.recentOrders.date"),
        className: "w-[120px]",
      },
    ];
  }, [t]);
  return (
    <div className="h-[400px] overflow-y-auto">
      <BaseTable<RecentOrdersData>
        columns={columns}
        data={data?.slice(0, 10) || []}
        isLoading={isLoading}
        getRowKey={(item) => item.orderId}
        rowClassName={() => "hover:bg-primary/5 transition-colors"}
      />
    </div>
  );
}
