import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  UserX,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Award,
  AlertCircle,
} from "lucide-react";
import userService from "@/services/userService";

interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  deleted_users: number;
  verified_users: number;
  unverified_users: number;
  users_by_role: {
    role_id: number;
    count: string;
    role: {
      id: number;
      name: string;
    };
  }[];
}

const StatisticsTab = () => {
  const { t } = useTranslation();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      const response = await userService.statistics();
      const data = response as { success: boolean; statistics: UserStatistics };
      setStatistics(data.statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
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
          {t("users.statistics.noDataAvailable")}
        </p>
      </div>
    );
  }

  const verificationPercentage =
    statistics.total_users > 0
      ? (statistics.verified_users / statistics.total_users) * 100
      : 0;

  return (
    <div className="p-3 space-y-3">
      {/* Overview Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {t("users.statistics.overview")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Users */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("users.statistics.totalUsers")}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {statistics.total_users.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("users.statistics.allRegistered")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          {/* Active Users */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("users.statistics.activeUsers")}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {statistics.active_users.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.total_users > 0
                    ? `${(
                        (statistics.active_users / statistics.total_users) *
                        100
                      ).toFixed(1)}% ${t("users.statistics.ofTotal")}`
                    : "0%"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Inactive Users */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("users.statistics.inactiveUsers")}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {statistics.inactive_users.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.total_users > 0
                    ? `${(
                        (statistics.inactive_users / statistics.total_users) *
                        100
                      ).toFixed(1)}% ${t("users.statistics.ofTotal")}`
                    : "0%"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <UserX className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          {/* Deleted Users */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("users.statistics.deletedUsers")}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {statistics.deleted_users.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("users.statistics.softDeleted")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Verification Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="p-3">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            {t("users.statistics.verificationStatus")}
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("users.statistics.verified")}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {statistics.verified_users.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("users.statistics.unverified")}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {statistics.unverified_users.toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {t("users.statistics.verificationRate")}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {verificationPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${verificationPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* User Account Status Summary */}
        <Card className="p-3">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            {t("users.statistics.accountStatusSummary")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {t("users.statistics.activeAccounts")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("users.statistics.canAccessPlatform")}
                  </p>
                </div>
              </div>
              <p className="text-xl font-bold text-green-600">
                {statistics.active_users.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {t("users.statistics.inactiveAccounts")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("users.statistics.temporarilyDisabled")}
                  </p>
                </div>
              </div>
              <p className="text-xl font-bold text-orange-600">
                {statistics.inactive_users.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {t("users.statistics.deletedAccounts")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("users.statistics.markedForDeletion")}
                  </p>
                </div>
              </div>
              <p className="text-xl font-bold text-red-600">
                {statistics.deleted_users.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users by Role */}
      <Card className="p-3">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" />
          {t("users.statistics.usersByRole")}
        </h4>
        <div className="space-y-3">
          {statistics.users_by_role.map((roleData) => {
            const userCount = parseInt(roleData.count);
            const percentage =
              statistics.total_users > 0
                ? (userCount / statistics.total_users) * 100
                : 0;

            return (
              <div
                key={roleData.role_id}
                className="p-3 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold capitalize">
                        {roleData.role.name.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("users.statistics.roleId")}: {roleData.role_id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {userCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% {t("users.statistics.ofTotal")}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default StatisticsTab;
