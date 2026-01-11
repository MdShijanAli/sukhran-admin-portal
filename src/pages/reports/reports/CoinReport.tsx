import { useTranslation } from "react-i18next";
import { coinReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const CoinReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.coinReport")}
        description={t("reports.coinReportDesc")}
        service={coinReportService}
        reportName="coin_report"
      />
    </div>
  );
};

export default CoinReport;
