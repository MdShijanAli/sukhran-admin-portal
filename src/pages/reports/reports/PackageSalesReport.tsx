import { useTranslation } from "react-i18next";
import { packageSalesReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const PackageSalesReport = () => {
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
  ];
  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.packageSalesReport")}
        description={t("reports.packageSalesReportDesc")}
        service={packageSalesReportService}
        reportName="package_sales_report"
        filters={filterItmes}
      />
    </div>
  );
};

export default PackageSalesReport;
