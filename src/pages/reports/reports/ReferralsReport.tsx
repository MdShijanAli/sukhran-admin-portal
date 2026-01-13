import { useTranslation } from "react-i18next";
import { referralReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const ReferralReport = () => {
  const { t } = useTranslation();

  //   status pending, locked, credited, cancelled
  const filterItmes = [
    {
      label: t("reports.filters.status"),
      value: "status", // API parameter name
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Locked",
          value: "locked",
        },
        {
          label: "Credited",
          value: "credited",
        },
        {
          label: "Cancelled",
          value: "cancelled",
        },
      ],
      placeholder: t("reports.filters.selectStatus"),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.referralReport")}
        description={t("reports.referralReportDesc")}
        service={referralReportService}
        reportName="referral_report"
        filters={filterItmes}
      />
    </div>
  );
};

export default ReferralReport;
