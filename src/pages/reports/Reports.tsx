import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Coins,
  Search,
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Report {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

const Reports = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const reports: Report[] = [
    {
      id: "transaction-report",
      name: t("reports.transactionReport"),
      description: t("reports.transactionReportDesc"),
      icon: "CreditCard",
      route: "/reports/transactions",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "package-sales-report",
      name: t("reports.packageSalesReport"),
      description: t("reports.packageSalesReportDesc"),
      icon: "Package",
      route: "/reports/package-sales",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "package-orders-report",
      name: t("reports.packageOrdersReport"),
      description: t("reports.packageOrdersReportDesc"),
      icon: "ShoppingCart",
      route: "/reports/package-orders",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "regular-sales-report",
      name: t("reports.regularSalesReport"),
      description: t("reports.regularSalesReportDesc"),
      icon: "TrendingUp",
      route: "/reports/regular-sales",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "regular-orders-report",
      name: t("reports.regularOrdersReport"),
      description: t("reports.regularOrdersReportDesc"),
      icon: "FileText",
      route: "/reports/regular-orders",
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "donation-report",
      name: t("reports.donationReport"),
      description: t("reports.donationReportDesc"),
      icon: "DollarSign",
      route: "/reports/donations",
      color: "from-teal-500 to-cyan-500",
    },
    {
      id: "coin-report",
      name: t("reports.coinReport"),
      description: t("reports.coinReportDesc"),
      icon: "Coins",
      route: "/reports/coins",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "referral-report",
      name: t("reports.referralReport"),
      description: t("reports.referralReportDesc"),
      icon: "TrendingUp",
      route: "/reports/referrals",
      color: "from-pink-500 to-red-500",
    },
  ];

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    CreditCard,
    Package,
    ShoppingCart,
    TrendingUp,
    FileText,
    Coins,
    DollarSign,
  };

  // Filter reports based on search query
  const filteredReports = reports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigateToReport = (route: string) => {
    navigate(route);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("reports.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("reports.subtitle")}</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("reports.searchReports")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {t("reports.noReportsFound")}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const IconComponent = iconMap[report.icon] || FileText;
            return (
              <Card
                key={report.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
                onClick={() => handleNavigateToReport(report.route)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${report.color} shadow-lg`}
                    >
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
                    {report.name}
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                    {t("reports.viewReport")}
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Info Section */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("reports.aboutReports")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• {t("reports.reportInfo1")}</p>
          <p>• {t("reports.reportInfo2")}</p>
          <p>• {t("reports.reportInfo3")}</p>
          <p>• {t("reports.reportInfo4")}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
