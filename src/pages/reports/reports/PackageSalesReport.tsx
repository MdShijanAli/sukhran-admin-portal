import { useTranslation } from "react-i18next";
import { ReportTableList } from "@/components/table/ReportTableList";
import { packageSalesReportService } from "@/services/reportService";

const PackageSalesReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.packageSalesReport")}
        description={t("reports.packageSalesReportDesc")}
        service={packageSalesReportService}
      />
    </div>
  );
};

export default PackageSalesReport;
