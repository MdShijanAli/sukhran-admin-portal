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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ShippingTab() {
  const { t } = useTranslation();

  const [freeShippingThreshold, setFreeShippingThreshold] = useState("1000");
  const [standardShippingCost, setStandardShippingCost] = useState("60");
  const [expressShippingCost, setExpressShippingCost] = useState("150");
  const [defaultShippingMethod, setDefaultShippingMethod] =
    useState("standard");

  const handleSave = () => {
    toast.success(t("settings.messages.shippingSaved"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.shipping.title")}</CardTitle>
        <CardDescription>{t("settings.shipping.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="freeShippingThreshold">
            {t("settings.shipping.freeShippingThreshold")}
          </Label>
          <Input
            id="freeShippingThreshold"
            type="number"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="standardShippingCost">
              {t("settings.shipping.standardCost")}
            </Label>
            <Input
              id="standardShippingCost"
              type="number"
              value={standardShippingCost}
              onChange={(e) => setStandardShippingCost(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expressShippingCost">
              {t("settings.shipping.expressCost")}
            </Label>
            <Input
              id="expressShippingCost"
              type="number"
              value={expressShippingCost}
              onChange={(e) => setExpressShippingCost(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultShippingMethod">
            {t("settings.shipping.defaultMethod")}
          </Label>
          <Select
            value={defaultShippingMethod}
            onValueChange={setDefaultShippingMethod}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                {t("settings.shipping.standard")}
              </SelectItem>
              <SelectItem value="express">
                {t("settings.shipping.express")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>{t("settings.actions.save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
