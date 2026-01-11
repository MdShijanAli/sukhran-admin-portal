import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coins,
  BarChart3,
} from "lucide-react";

interface ReportStatisticsProps {
  data: Record<string, unknown>;
}

// Helper to format field names
const formatLabel = (key: string, t: (key: string) => string): string => {
  // Try to get translation first
  const translationKey = `reports.statistics.${key}`;
  const translated = t(translationKey);

  // If translation exists (not the same as key), return it
  if (translated !== translationKey) {
    return translated;
  }

  // Fallback to formatting the key
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper to format values based on type
const formatValue = (key: string, value: unknown): string => {
  if (value === null || value === undefined) return "-";

  const keyLower = key.toLowerCase();

  // Handle boolean
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // Handle percentage
  if (keyLower.includes("percentage")) {
    return `${Number(value).toFixed(2)}%`;
  }

  // Handle currency
  if (
    keyLower.includes("revenue") ||
    (keyLower.includes("total") &&
      (keyLower.includes("vat") ||
        keyLower.includes("charge") ||
        keyLower.includes("delivery"))) ||
    (keyLower.includes("average") && keyLower.includes("value"))
  ) {
    return `৳${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Handle numbers with comma formatting
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return value.toLocaleString("en-US");
    }
    return value.toFixed(2);
  }

  return String(value);
};

// Get icon based on field name
const getIcon = (key: string) => {
  const keyLower = key.toLowerCase();

  if (
    keyLower.includes("revenue") ||
    (keyLower.includes("total") &&
      (keyLower.includes("vat") || keyLower.includes("charge")))
  ) {
    return DollarSign;
  }
  if (keyLower.includes("order") || keyLower.includes("batch")) {
    return ShoppingCart;
  }
  if (keyLower.includes("customer") || keyLower.includes("user")) {
    return Users;
  }
  if (keyLower.includes("pending")) {
    return Clock;
  }
  if (
    keyLower.includes("confirmed") ||
    keyLower.includes("delivered") ||
    keyLower.includes("paid")
  ) {
    return CheckCircle;
  }
  if (keyLower.includes("cancelled") || keyLower.includes("failed")) {
    return XCircle;
  }
  if (keyLower.includes("package")) {
    return Package;
  }
  if (keyLower.includes("coin")) {
    return Coins;
  }
  if (keyLower.includes("average") || keyLower.includes("percentage")) {
    return BarChart3;
  }
  if (keyLower.includes("shipped") || keyLower.includes("paused")) {
    return AlertCircle;
  }

  return TrendingUp;
};

// Get card color variant based on field name
const getCardVariant = (key: string): string => {
  const keyLower = key.toLowerCase();

  if (keyLower.includes("revenue") || keyLower.includes("paid")) {
    return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
  }
  if (keyLower.includes("pending")) {
    return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800";
  }
  if (keyLower.includes("cancelled") || keyLower.includes("failed")) {
    return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
  }
  if (keyLower.includes("confirmed") || keyLower.includes("delivered")) {
    return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800";
  }
  if (keyLower.includes("total")) {
    return "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800";
  }

  return "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800";
};

// Helper to categorize fields
const categorizeFields = (data: Record<string, unknown>) => {
  const categories: Record<string, Array<[string, unknown]>> = {
    overview: [],
    status: [],
    payment: [],
    financial: [],
    items: [],
    other: [],
  };

  Object.entries(data).forEach(([key, value]) => {
    const keyLower = key.toLowerCase();

    // Skip certain fields
    if (keyLower === "success" || keyLower === "message") {
      return;
    }

    // Categorize based on field name
    if (keyLower.includes("date_range") || keyLower.includes("date_filter")) {
      categories.overview.push([key, value]);
    } else if (keyLower.startsWith("status_")) {
      categories.status.push([key, value]);
    } else if (keyLower.includes("payment")) {
      categories.payment.push([key, value]);
    } else if (
      keyLower.includes("revenue") ||
      keyLower.includes("vat") ||
      keyLower.includes("charge") ||
      keyLower.includes("average_order_value") ||
      keyLower.includes("potential")
    ) {
      categories.financial.push([key, value]);
    } else if (
      keyLower.includes("items") ||
      keyLower.includes("quantity") ||
      keyLower.includes("coin")
    ) {
      categories.items.push([key, value]);
    } else if (
      keyLower.includes("total_") ||
      keyLower.includes("locked") ||
      keyLower.includes("unlocked") ||
      keyLower.includes("payment_mode")
    ) {
      categories.overview.push([key, value]);
    } else {
      categories.other.push([key, value]);
    }
  });

  return categories;
};

const ReportStatistics = ({ data }: ReportStatisticsProps) => {
  const { t } = useTranslation();

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            {t("reports.statistics.noStatistics")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("reports.statistics.generateToView")}
          </p>
        </div>
      </div>
    );
  }

  const categories = categorizeFields(data);

  const renderStatCard = (key: string, value: unknown) => {
    const Icon = getIcon(key);
    const variant = getCardVariant(key);

    return (
      <Card key={key} className={`${variant} transition-all hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {formatLabel(key, t)}
              </p>
              <p className="text-2xl font-bold">{formatValue(key, value)}</p>
            </div>
            <div className="ml-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSection = (title: string, fields: Array<[string, unknown]>) => {
    if (fields.length === 0) return null;

    return (
      <div key={title} className="space-y-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {fields.map(([key, value]) => renderStatCard(key, value))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      {(data.message || data.date_range || data.date_filter_type) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("reports.statistics.reportInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.message && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{String(data.message)}</span>
              </div>
            )}
            {data.date_range && (
              <div className="text-sm text-muted-foreground">
                <strong>{t("reports.statistics.dateRange")}:</strong>{" "}
                {String(data.date_range)}
              </div>
            )}
            {data.date_filter_type && (
              <div className="text-sm text-muted-foreground">
                <strong>{t("reports.statistics.filterType")}:</strong>{" "}
                {String(data.date_filter_type)}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overview Section */}
      {renderSection(t("reports.statistics.overview"), categories.overview)}

      {/* Status Section */}
      {renderSection(t("reports.statistics.orderStatus"), categories.status)}

      {/* Payment Section */}
      {renderSection(
        t("reports.statistics.paymentStatistics"),
        categories.payment
      )}

      {/* Financial Section */}
      {renderSection(
        t("reports.statistics.financialSummary"),
        categories.financial
      )}

      {/* Items Section */}
      {renderSection(t("reports.statistics.itemsAndCoins"), categories.items)}

      {/* Other Section */}
      {categories.other.length > 0 &&
        renderSection(
          t("reports.statistics.additionalMetrics"),
          categories.other
        )}
    </div>
  );
};

export default ReportStatistics;
