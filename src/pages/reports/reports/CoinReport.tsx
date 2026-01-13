import { useTranslation } from "react-i18next";
import { coinReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const CoinReport = () => {
  const { t } = useTranslation();

  const filterItmes = [
    {
      label: t("reports.filters.type"),
      value: "type", // API parameter name
      options: [
        {
          label: "Earned",
          value: "earned",
        },
        {
          label: "Spent",
          value: "spent",
        },
      ],
      placeholder: t("reports.filters.selectType"),
    },
    {
      label: t("reports.filters.source_type"),
      value: "source_type", // API parameter name
      options: [
        {
          label: "Admin Credit",
          value: "admin_credit",
        },
        {
          label: "Package Purchase",
          value: "package_purchase",
        },
        {
          label: "Order Discount",
          value: "order_discount",
        },
        {
          label: "Donation",
          value: "donation",
        },
        {
          label: "Referral Reward",
          value: "referral_reward",
        },
      ],
      placeholder: t("reports.filters.selectSourceType"),
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
