import { useTranslation } from "react-i18next";
import { ReportTableList } from "@/components/table/ReportTableList";
import { transactionReportService } from "@/services/reportService";

const TransactionReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.transactionReport")}
        description={t("reports.transactionReportDesc")}
        service={transactionReportService}
      />
    </div>
  );
};

export default TransactionReport;
