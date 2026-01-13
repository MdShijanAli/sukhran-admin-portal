import { useTranslation } from "react-i18next";
import { packageOrdersReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const PackageOrdersReport = () => {
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
        title={t("reports.packageOrdersReport")}
        description={t("reports.packageOrdersReportDesc")}
        service={packageOrdersReportService}
        reportName="package_orders_report"
        filters={filterItmes}
      />
    </div>
  );
};

export default PackageOrdersReport;
