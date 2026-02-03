import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PackageOrderBatch } from "@/lib/types";
import { usePackageOrderStore } from "@/stores/packageOrderStore";
import orderService from "@/services/orderService";
import { BaseTableList } from "@/components/table/BaseTableList";
import { Column } from "@/components/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import PackageBatchDetailsModal from "../modal/PackageBatchDetailsModal";
import { ActionItem, DropdownMenuActions } from "@/components/table";
import usePermissions from "@/hooks/use-permissions";
import getSerialNumber from "@/lib/getSerialNumber";

export default function PackageOrdersTab() {
  const { t } = useTranslation();
  const store = usePackageOrderStore();
  const [selectedBatch, setSelectedBatch] = useState<PackageOrderBatch | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
  const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);

  const handleViewDetails = (batch: PackageOrderBatch) => {
    setSelectedBatch(batch);
    setShowDetails(true);
  };

  const handleSetRefresh = useCallback((refreshFn: () => void) => {
    setRefreshTable(() => refreshFn);
  }, []);

  // Define actions for dropdown menu
  const orderActions = (
    order: PackageOrderBatch
  ): ActionItem<PackageOrderBatch>[] => [
      {
        label: t("orders.actions.viewDetails"),
        icon: Eye,
        onClick: handleViewDetails,
      },
    ];

  const columns: Column<PackageOrderBatch>[] = useMemo(
    () => [
      {
        key: "sl",
        label: t("orders.columns.sl"),
        render: (_, index) => getSerialNumber(store, index),
        className: "text-center w-16",
      },
      {
        key: "package_name",
        label: t("orders.packageOrders.packageName"),
        render: (batch) => (
          <div>
            <p className="font-medium">{batch.package_name}</p>
          </div>
        ),
      },
      {
        key: "batch_id",
        label: t("orders.packageOrders.batchId"),
        render: (batch) => (
          <div className="w-[120px]">
            <span className="font-mono text-sm">{batch.batch_id}</span>
          </div>
        ),
      },
      {
        key: "customer",
        label: t("orders.packageOrders.customer"),
        render: (batch) => (
          <div>
            <p className="font-medium">{batch.customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {batch.customer.email}
            </p>
          </div>
        ),
      },
      {
        key: "schedule",
        label: t("orders.packageOrders.schedule"),
        render: (batch) => (
          <div className="text-sm w-[90px]">
            <p>
              {batch.schedule_months} {t("orders.packageOrders.months")}
            </p>
            <p className="text-muted-foreground">
              {batch.frequency_per_month}x {t("orders.packageOrders.perMonth")}
            </p>
          </div>
        ),
      },
      {
        key: "total_orders",
        label: t("orders.packageOrders.totalOrders"),
        render: (batch) => (
          <div className="w-[90px]">
            <span className="">{batch.total_orders}</span>
          </div>
        ),
        className: "text-center",
      },
      {
        key: "pending_count",
        label: t("orders.packageOrders.pending"),
        render: (batch) => (
          <Badge variant="outline" className="border-warning/20 text-warning">
            {batch.pending_count}
          </Badge>
        ),
        className: "text-center",
      },
      {
        key: "delivered_count",
        label: t("orders.packageOrders.delivered"),
        render: (batch) => (
          <Badge variant="outline" className="border-success/20 text-success">
            {batch.delivered_count}
          </Badge>
        ),
        className: "text-center",
      },
      {
        key: "payment_available_count",
        label: t("orders.packageOrders.paymentAvailable"),
        render: (batch) => (
          <Badge variant="outline" className="border-blue-500/20 text-blue-500">
            {batch.payment_available_count}
          </Badge>
        ),
        className: "text-center",
      },
      {
        key: "created_at",
        label: t("orders.packageOrders.createdAt"),
        render: (batch) => (
          <span className="text-sm">
            {new Date(batch.created_at).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: "actions",
        label: t("orders.packageOrders.actions"),
        className: "text-right",
        render: (order) => (
          <DropdownMenuActions item={order} actions={orderActions(order)} />
        ),
      },
    ],
    [t, handleViewDetails]
  );

  return (
    <>
      <BaseTableList<PackageOrderBatch>
        title={t("orders.packageOrders.title")}
        description={t("orders.packageOrders.subtitle")}
        searchPlaceholder={t("orders.searchPlaceholder")}
        enableSearch={true}
        columns={columns}
        service={orderService}
        serviceMethod={orderService.fetchPackageOrders}
        store={store}
        onRefresh={handleSetRefresh}
        emptyMessage={t("orders.packageOrders.noOrders")}
        getRowKey={(batch) => batch.batch_id}
        showDateFilter={true}
      />

      <PackageBatchDetailsModal
        open={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedBatch(null);
        }}
        batchId={selectedBatch?.batch_id || null}
      />

      {/* <UpdateDeliveryTimeModal
        open={showUpdateDeliveryTimeModal}
        onClose={setShowUpdateDeliveryTimeModal}
        orderId={selectedOrder?.batch_id || null}
        onSuccess={() => refreshTable?.()}
      /> */}
    </>
  );
}
