import { useTranslation } from "react-i18next";
import { donationReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const DonationReport = () => {
  const { t } = useTranslation();

  const filterItmes = [
    {
      label: t("reports.filters.date_filter_type"),
      value: "date_filter_type", // API parameter name
      options: [
        {
          label: "Created At",
          value: "created_at",
        },
        {
          label: "Delivery Date",
          value: "delivery_date",
        },
      ],
      placeholder: t("reports.filters.selectDateFilterType"),
    },
    {
      label: t("reports.filters.payment_status"),
      value: "status", // API parameter name
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Paid",
          value: "paid",
        },
        {
          label: "Failed",
          value: "failed",
        },
      ],
      placeholder: t("reports.filters.selectPaymentStatus"),
    },
    {
      label: t("reports.filters.donation_type"),
      value: "donation_type", // API parameter name
      options: [
        {
          label: "Product",
          value: "product",
        },
        {
          label: "Package",
          value: "package",
        },
        {
          label: "Standalone",
          value: "standalone",
        },
      ],
      placeholder: t("reports.filters.selectDonationType"),
    },
    {
      label: t("reports.filters.payment_method"),
      value: "payment_method", // API parameter name
      options: [
        {
          label: "Cash on Delivery",
          value: "cod",
        },
        {
          label: "Online",
          value: "online",
        },
      ],
      placeholder: t("reports.filters.selectPaymentMethod"),
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.donationReport")}
        description={t("reports.donationReportDesc")}
        service={donationReportService}
        reportName="donation_report"
        filters={filterItmes}
      />
    </div>
  );
};

export default DonationReport;
