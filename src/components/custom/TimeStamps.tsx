import { Calendar } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface TimeStapsProps {
  item?: {
    created_at?: string;
    updated_at?: string;
  };
  className?: string;
}
const TimeStaps: React.FC<TimeStapsProps> = ({ item, className }) => {
  const { t } = useTranslation();
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {item?.created_at && (
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">{t("created")}</span>
          </div>
          <p className="text-sm font-semibold">
            {new Date(item?.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(item?.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}
      {item?.updated_at && (
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">{t("lastUpdated")}</span>
          </div>
          <p className="text-sm font-semibold">
            {new Date(item?.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(item?.updated_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeStaps;
