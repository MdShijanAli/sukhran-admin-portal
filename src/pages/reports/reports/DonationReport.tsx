import { useTranslation } from "react-i18next";
import { donationReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const DonationReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.donationReport")}
        description={t("reports.donationReportDesc")}
        service={donationReportService}
        reportName="donation_report"
      />
    </div>
  );
};

export default DonationReport;
