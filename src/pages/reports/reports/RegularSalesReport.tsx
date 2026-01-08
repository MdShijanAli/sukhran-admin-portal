import { useTranslation } from "react-i18next";
import { ReportTableList } from "@/components/table/ReportTableList";
import { regularSalesReportService } from "@/services/reportService";

const RegularSalesReport = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in space-y-6">
      <ReportTableList
        title={t("reports.regularSalesReport")}
        description={t("reports.regularSalesReportDesc")}
        service={regularSalesReportService}
      />
    </div>
  );
};

export default RegularSalesReport;
