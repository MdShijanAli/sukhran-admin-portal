import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  MessageSquare,
  Calendar,
  Target,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSupportStore } from "@/stores/supportStore";
import supportService from "@/services/supportService";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function StatisticsTab() {
  const { t } = useTranslation();
  const { statistics } = useSupportStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      await supportService.getStatistics();
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {t("support.statistics.noData")}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Today's Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t("support.statistics.today")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  {t("support.statistics.newTickets")}
                </p>
                <p className="text-3xl  text-blue-900 dark:text-blue-100">
                  {statistics.today.new_tickets}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-700 dark:text-blue-300" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                  {t("support.statistics.inProgress")}
                </p>
                <p className="text-3xl  text-amber-900 dark:text-amber-100">
                  {statistics.today.in_progress}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-700 dark:text-amber-300" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                  {t("support.statistics.resolved")}
                </p>
                <p className="text-3xl  text-green-900 dark:text-green-100">
                  {statistics.today.resolved}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Current Status */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          {t("support.statistics.currentStatus")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("support.statistics.open")}
                </p>
                <p className="text-2xl ">{statistics.current_status.open}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("support.statistics.inProgress")}
                </p>
                <p className="text-2xl ">
                  {statistics.current_status.in_progress}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("support.statistics.resolved")}
                </p>
                <p className="text-2xl ">
                  {statistics.current_status.resolved}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("support.statistics.closed")}
                </p>
                <p className="text-2xl ">{statistics.current_status.closed}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("support.statistics.totalActive")}
                </p>
                <p className="text-2xl ">
                  {statistics.current_status.total_active}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* By Category & Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By Category */}
        <Card className="p-4">
          <h4 className="font-semibold mb-4">
            {t("support.statistics.byCategory")}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(statistics.by_category).map(([category, count]) => (
              <div
                key={category}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <span className="text-sm font-medium capitalize">
                  {t(`support.tickets.category.${category}`)}
                </span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* By Priority */}
        <Card className="p-4">
          <h4 className="font-semibold mb-4">
            {t("support.statistics.byPriority")}
          </h4>
          <div className="space-y-3">
            {Object.entries(statistics.by_priority).map(([priority, count]) => {
              const colors: Record<string, string> = {
                urgent: "bg-red-500",
                high: "bg-orange-500",
                medium: "bg-yellow-500",
                low: "bg-green-500",
              };
              return (
                <div
                  key={priority}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        colors[priority] || "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium capitalize">
                      {t(`support.tickets.priority.${priority}`)}
                    </span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {t("support.statistics.recentTickets")}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {statistics.recent_tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-3 border rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium">
                      {ticket.ticketNumber}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {t(`support.tickets.category.${ticket.category}`)}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.customer} • {formatDate(ticket.created_at)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      ticket.status === "open"
                        ? "default"
                        : ticket.status === "resolved"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {t(`support.tickets.status.${ticket.status}`)}
                  </Badge>
                  <Badge
                    variant={
                      ticket.priority === "urgent"
                        ? "destructive"
                        : ticket.priority === "high"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {t(`support.tickets.priority.${ticket.priority}`)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Metrics */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4">
          {t("support.statistics.metrics")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              {t("support.statistics.avgResolutionTime")}
            </p>
            <p className="text-3xl ">
              {statistics.metrics.avg_resolution_time_hours.toFixed(1)}{" "}
              <span className="text-lg font-normal text-muted-foreground">
                {t("support.statistics.hours")}
              </span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
