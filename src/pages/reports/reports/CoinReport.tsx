import { useTranslation } from "react-i18next";
import { coinReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const CoinReport = () => {
  const { t } = useTranslation();

  const filterItmes = [
    {
      label: t("reports.filters.payment_status"),
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
      placeholder: t("reports.filters.selectPaymentStatus"),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.coinReport")}
        description={t("reports.coinReportDesc")}
        service={coinReportService}
        reportName="coin_report"
        filters={filterItmes}
      />
    </div>
  );
};

export default CoinReport;
