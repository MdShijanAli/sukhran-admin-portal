import { useTranslation } from "react-i18next";
import { transactionReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const TransactionReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.transactionReport")}
        description={t("reports.transactionReportDesc")}
        service={transactionReportService}
        reportName="transaction_report"
      />
    </div>
  );
};

export default TransactionReport;
