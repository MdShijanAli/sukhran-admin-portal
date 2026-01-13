import { useTranslation } from "react-i18next";
import { transactionReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const TransactionReport = () => {
  const { t } = useTranslation();

  const filterItmes = [
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
      label: t("reports.filters.status"),
      value: "status", // API parameter name
      options: [
        {
          label: "All",
          value: "success",
        },
        {
          label: "Pending",
          value: "pending",
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
      placeholder: t("reports.filters.selectStatus"),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.transactionReport")}
        description={t("reports.transactionReportDesc")}
        service={transactionReportService}
        reportName="transaction_report"
        filters={filterItmes}
      />
    </div>
  );
};

export default TransactionReport;
