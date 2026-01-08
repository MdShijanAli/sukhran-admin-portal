import { useTranslation } from "react-i18next";
import { ReportTableList } from "@/components/table/ReportTableList";
import { regularOrdersReportService } from "@/services/reportService";

const RegularOrdersReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.regularOrdersReport")}
        description={t("reports.regularOrdersReportDesc")}
        service={regularOrdersReportService}
      />
    </div>
  );
};

export default RegularOrdersReport;
