import { useTranslation } from "react-i18next";
import { regularOrdersReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const RegularOrdersReport = () => {
  const { t } = useTranslation();

  const filterItmes = [
    {
      label: t("reports.filters.date_filter_type"),
      value: "date_filter_type", // API parameter name
      options: [
        {
          label: "Created At",
          value: "created_at",
        },
        {
          label: "Delivery Date",
          value: "delivery_date",
        },
      ],
      placeholder: t("reports.filters.selectDateFilterType"),
    },
    {
      label: t("reports.filters.payment_mode"),
      value: "payment_mode", // API parameter name
      options: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Online",
          value: "online",
        },
        {
          label: "Cash on Delivery",
          value: "cod",
        },
      ],
      placeholder: t("reports.filters.selectTransactionType"),
    },
    {
      label: t("reports.filters.orderStatus"),
      value: "status", // API parameter name
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Refunded",
          value: "refunded",
        },
        {
          label: "Delivered",
          value: "delivered",
        },
        {
          label: "Cancelled",
          value: "cancelled",
        },
        {
          label: "Returned",
          value: "returned",
        },
      ],
      placeholder: t("reports.filters.selectOrderStatus"),
    },
    {
      label: t("reports.filters.payment_status"),
      value: "payment_status", // API parameter name
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Paid",
          value: "paid",
        },
        {
          label: "Failed",
          value: "failed",
        },
        {
          label: "Refunded",
          value: "refunded",
        },
      ],
      placeholder: t("reports.filters.selectPaymentStatus"),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.regularOrdersReport")}
        description={t("reports.regularOrdersReportDesc")}
        service={regularOrdersReportService}
        reportName="regular_orders_report"
        filters={filterItmes}
      />
    </div>
  );
};

export default RegularOrdersReport;
