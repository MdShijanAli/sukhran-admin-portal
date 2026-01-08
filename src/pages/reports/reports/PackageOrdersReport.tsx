import { useTranslation } from "react-i18next";
import { ReportTableList } from "@/components/table/ReportTableList";
import { packageOrdersReportService } from "@/services/reportService";

const PackageOrdersReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.packageOrdersReport")}
        description={t("reports.packageOrdersReportDesc")}
        service={packageOrdersReportService}
      />
    </div>
  );
};

export default PackageOrdersReport;
