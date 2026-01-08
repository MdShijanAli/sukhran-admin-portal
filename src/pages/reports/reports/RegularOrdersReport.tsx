import { useTranslation } from "react-i18next";
import { regularOrdersReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const RegularOrdersReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.regularOrdersReport")}
        description={t("reports.regularOrdersReportDesc")}
        service={regularOrdersReportService}
        reportName="regular_orders_report"
      />
    </div>
  );
};

export default RegularOrdersReport;
