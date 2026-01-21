import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Plus,
  Minus,
  Trash2,
  RefreshCw,
  User,
  Loader2,
} from "lucide-react";
import orderService from "@/services/orderService";
import { formatDistanceToNow } from "date-fns";

interface ModificationDetails {
  type: string;
  itemName?: string;
  productName?: string;
  skuName?: string;
  oldQuantity?: string | number;
  newQuantity?: number;
  quantity?: string | number;
  unitPrice?: number | string;
  itemType?: string;
}

interface ModificationRecord {
  type: "quantity_changed" | "item_added" | "item_removed";
  details: ModificationDetails;
  reason: string;
  modifiedBy: {
    id: number;
    name: string;
  };
  modifiedAt: string;
}

interface ModificationHistoryModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  orderId: number | string | null;
}

const ModificationHistoryModal = ({
  open,
  onClose,
  orderId,
}: ModificationHistoryModalProps) => {
  const { t } = useTranslation();
  const [modifications, setModifications] = useState<ModificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchModificationHistory = async () => {
      if (!orderId || !open) return;

      setIsLoading(true);
      try {
        const response = await orderService.getModificationHistory(orderId);
        const data = response?.data || response;
        setModifications(data);
      } catch (error) {
        console.error("Error fetching modification history:", error);
        setModifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModificationHistory();
  }, [orderId, open]);

  const getModificationIcon = (type: string) => {
    switch (type) {
      case "quantity_changed":
        return RefreshCw;
      case "item_added":
        return Plus;
      case "item_removed":
        return Trash2;
      default:
        return Clock;
    }
  };

  const getModificationColor = (type: string) => {
    switch (type) {
      case "quantity_changed":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900";
      case "item_added":
        return "text-green-600 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900";
      case "item_removed":
        return "text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900";
      default:
        return "text-muted-foreground bg-muted/50";
    }
  };

  const getModificationBadgeVariant = (type: string) => {
    switch (type) {
      case "quantity_changed":
        return "default";
      case "item_added":
        return "success";
      case "item_removed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatModificationTitle = (modification: ModificationRecord) => {
    const { type, details } = modification;

    switch (type) {
      case "quantity_changed":
        return t("orders.modificationHistory.quantityChanged");
      case "item_added":
        return t("orders.modificationHistory.itemAdded");
      case "item_removed":
        return t("orders.modificationHistory.itemRemoved");
      default:
        return type.replace(/_/g, " ");
    }
  };

  const renderModificationDetails = (modification: ModificationRecord) => {
    const { type, details } = modification;

    switch (type) {
      case "quantity_changed":
        return (
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">
                {t("orders.modificationHistory.item")}:
              </span>{" "}
              {details.itemName}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Minus className="h-3 w-3 text-red-500" />
                <span className="font-medium">
                  {t("orders.modificationHistory.oldQuantity")}:
                </span>{" "}
                <Badge variant="outline">{details.oldQuantity}</Badge>
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="flex items-center gap-1">
                <Plus className="h-3 w-3 text-green-500" />
                <span className="font-medium">
                  {t("orders.modificationHistory.newQuantity")}:
                </span>{" "}
                <Badge variant="outline">{details.newQuantity}</Badge>
              </span>
            </div>
          </div>
        );

      case "item_added":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">
                  {t("orders.modificationHistory.product")}:
                </span>{" "}
                {details.productName}
              </div>
              <div>
                <span className="font-medium">
                  {t("orders.modificationHistory.variant")}:
                </span>{" "}
                {details.skuName}
              </div>
              <div>
                <span className="font-medium">
                  {t("orders.modificationHistory.quantity")}:
                </span>{" "}
                <Badge variant="outline">{details.quantity}</Badge>
              </div>
              <div>
                <span className="font-medium">
                  {t("orders.modificationHistory.unitPrice")}:
                </span>{" "}
                ৳{details.unitPrice}
              </div>
            </div>
            <div className="pt-2 border-t">
              <span className="font-medium text-sm">
                {t("orders.modificationHistory.totalPrice")}:
              </span>{" "}
              <span className="text-lg  text-primary">
                ৳
                {(Number(details.quantity) * Number(details.unitPrice)).toFixed(
                  2,
                )}
              </span>
            </div>
          </div>
        );

      case "item_removed":
        return (
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">
                {t("orders.modificationHistory.item")}:
              </span>{" "}
              {details.itemName}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">
                  {t("orders.modificationHistory.quantity")}:
                </span>{" "}
                <Badge variant="outline">{details.quantity}</Badge>
              </div>
              <div>
                <span className="font-medium">
                  {t("orders.modificationHistory.unitPrice")}:
                </span>{" "}
                ৳{details.unitPrice}
              </div>
            </div>
            <div className="pt-2 border-t">
              <span className="font-medium text-sm">
                {t("orders.modificationHistory.removedValue")}:
              </span>{" "}
              <span className="text-lg  text-destructive">
                -৳
                {(Number(details.quantity) * Number(details.unitPrice)).toFixed(
                  2,
                )}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("orders.modificationHistory.title")}
      showSubmitButton={false}
      closeButtonText={t("close")}
      size="2xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">
              {t("orders.modificationHistory.loading")}
            </p>
          </div>
        </div>
      ) : modifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t("orders.modificationHistory.noModifications")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("orders.modificationHistory.noModificationsDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">
                {t("orders.modificationHistory.totalModifications")}:{" "}
                {modifications.length}
              </span>
            </div>
          </div>

          <div className="relative space-y-4">
            {modifications.map((modification, index) => {
              const Icon = getModificationIcon(modification.type);
              const colorClass = getModificationColor(modification.type);

              return (
                <div key={index} className="relative pl-8">
                  {/* Timeline line */}
                  {index !== modifications.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border" />
                  )}

                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0">
                    <div className={`p-2 rounded-full border ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="border rounded-lg overflow-hidden ml-3">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">
                          {formatModificationTitle(modification)}
                        </h4>
                        <Badge
                          variant={getModificationBadgeVariant(
                            modification.type,
                          )}
                          className="text-xs"
                        >
                          {modification.type.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(modification.modifiedAt),
                          {
                            addSuffix: true,
                          },
                        )}
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      {renderModificationDetails(modification)}

                      {modification.reason && (
                        <div className="pt-3 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            {t("orders.modificationHistory.reason")}:
                          </p>
                          <p className="text-sm bg-muted/50 p-2 rounded">
                            {modification.reason}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>
                          {t("orders.modificationHistory.modifiedBy")}:{" "}
                          <span className="font-medium">
                            {modification.modifiedBy.name}
                          </span>
                        </span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(modification.modifiedAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default ModificationHistoryModal;
