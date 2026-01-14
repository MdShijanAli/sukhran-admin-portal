import { Activity, CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "pending":
      return <Clock className="w-5 h-5 text-orange-600" />;
    case "failed":
    case "cancelled":
      return <XCircle className="w-5 h-5 text-red-600" />;
    case "refunded":
      return <RefreshCw className="w-5 h-5 text-blue-600" />;
    default:
      return <Activity className="w-5 h-5 text-gray-600" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
      return "text-green-600 bg-green-50 dark:bg-green-950";
    case "pending":
      return "text-orange-600 bg-orange-50 dark:bg-orange-950";
    case "failed":
    case "cancelled":
      return "text-red-600 bg-red-50 dark:bg-red-950";
    case "refunded":
      return "text-blue-600 bg-blue-50 dark:bg-blue-950";
    default:
      return "text-gray-600 bg-gray-50 dark:bg-gray-950";
  }
};
