import { useTranslation } from "react-i18next";
import { regularSalesReportService } from "@/services/reportService";
import { ReportTableList } from "@/components/table/ReportTableList";

const RegularSalesReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.regularSalesReport")}
        description={t("reports.regularSalesReportDesc")}
        service={regularSalesReportService}
        reportName="regular_sales_report"
      />
    </div>
  );
};

export default RegularSalesReport;
