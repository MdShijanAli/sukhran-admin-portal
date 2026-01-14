import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SystemTab() {
  const { t } = useTranslation();

  const [autoApproveOrders, setAutoApproveOrders] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);
  const [enableReviews, setEnableReviews] = useState(true);
  const [enableWishlist, setEnableWishlist] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [orderPrefix, setOrderPrefix] = useState("ORD-");

  const handleSave = () => {
    toast.success(t("settings.messages.systemSaved"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.system.title")}</CardTitle>
        <CardDescription>{t("settings.system.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.system.autoApproveOrders")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.system.autoApproveOrdersDesc")}
            </p>
          </div>
          <Switch
            checked={autoApproveOrders}
            onCheckedChange={setAutoApproveOrders}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.system.maintenanceMode")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.system.maintenanceModeDesc")}
            </p>
          </div>
          <Switch
            checked={maintenanceMode}
            onCheckedChange={setMaintenanceMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.system.showOutOfStock")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.system.showOutOfStockDesc")}
            </p>
          </div>
          <Switch
            checked={showOutOfStock}
            onCheckedChange={setShowOutOfStock}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.system.allowGuestCheckout")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.system.allowGuestCheckoutDesc")}
            </p>
          </div>
          <Switch
            checked={allowGuestCheckout}
            onCheckedChange={setAllowGuestCheckout}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.system.enableReviews")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.system.enableReviewsDesc")}
            </p>
          </div>
          <Switch checked={enableReviews} onCheckedChange={setEnableReviews} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.system.enableWishlist")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.system.enableWishlistDesc")}
            </p>
          </div>
          <Switch
            checked={enableWishlist}
            onCheckedChange={setEnableWishlist}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">
            {t("settings.system.lowStockThreshold")}
          </Label>
          <Input
            id="lowStockThreshold"
            type="number"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderPrefix">
            {t("settings.system.orderPrefix")}
          </Label>
          <Input
            id="orderPrefix"
            value={orderPrefix}
            onChange={(e) => setOrderPrefix(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>{t("settings.actions.save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
