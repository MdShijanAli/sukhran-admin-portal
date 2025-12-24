import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Calendar,
  Download,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reportTypes } from "@/data/mockData";
import ComingSoon from "@/components/custom/ComingSoon";

const iconMap = {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Calendar,
};

const Reports = () => {
  const { t } = useTranslation();
  const isProduction = import.meta.env.PROD;

  const handleGenerateReport = (reportId: string) => {
    console.log("Generating report:", reportId);
    // Report generation logic here
  };

  // Show Coming Soon in production mode
  if (isProduction) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <ComingSoon />
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate and export detailed business reports
          </p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              Generated this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Auto-generated reports
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <p className="text-xs text-muted-foreground">Total downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exports</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">From last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => {
            const IconComponent = iconMap[report.icon as keyof typeof iconMap];
            return (
              <Card
                key={report.id}
                className="group hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Last generated: Today
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleGenerateReport(report.id)}
                    >
                      <FileText className="h-4 w-4" />
                      Generate
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>
            Choose your preferred format for report exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export as PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export as Excel
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export as CSV
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Email Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
