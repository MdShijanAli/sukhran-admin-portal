import { useTranslation } from "react-i18next";
import { regularSalesReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const RegularSalesReport = () => {
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
  ];
  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.regularSalesReport")}
        description={t("reports.regularSalesReportDesc")}
        service={regularSalesReportService}
        reportName="regular_sales_report"
        filters={filterItmes}
      />
    </div>
  );
};

export default RegularSalesReport;
