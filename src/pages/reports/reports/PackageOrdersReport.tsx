import { useTranslation } from "react-i18next";
import { packageOrdersReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const PackageOrdersReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.packageOrdersReport")}
        description={t("reports.packageOrdersReportDesc")}
        service={packageOrdersReportService}
        reportName="package_orders_report"
      />
    </div>
  );
};

export default PackageOrdersReport;
