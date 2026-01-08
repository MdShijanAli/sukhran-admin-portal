import { useTranslation } from "react-i18next";
import { packageSalesReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const PackageSalesReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.packageSalesReport")}
        description={t("reports.packageSalesReportDesc")}
        service={packageSalesReportService}
        reportName="package_sales_report"
      />
    </div>
  );
};

export default PackageSalesReport;
