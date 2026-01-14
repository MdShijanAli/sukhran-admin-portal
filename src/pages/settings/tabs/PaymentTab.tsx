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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PaymentTab() {
  const { t } = useTranslation();

  const [paymentGateway, setPaymentGateway] = useState("stripe");
  const [enableCOD, setEnableCOD] = useState(true);
  const [enableBankTransfer, setEnableBankTransfer] = useState(true);
  const [minOrderAmount, setMinOrderAmount] = useState("100");

  const handleSave = () => {
    toast.success(t("settings.messages.paymentSaved"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.payment.title")}</CardTitle>
        <CardDescription>{t("settings.payment.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="paymentGateway">
            {t("settings.payment.gateway")}
          </Label>
          <Select value={paymentGateway} onValueChange={setPaymentGateway}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="nagad">Nagad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.payment.enableCOD")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.payment.enableCODDesc")}
            </p>
          </div>
          <Switch checked={enableCOD} onCheckedChange={setEnableCOD} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("settings.payment.enableBankTransfer")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.payment.enableBankTransferDesc")}
            </p>
          </div>
          <Switch
            checked={enableBankTransfer}
            onCheckedChange={setEnableBankTransfer}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minOrderAmount">
            {t("settings.payment.minOrderAmount")}
          </Label>
          <Input
            id="minOrderAmount"
            type="number"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>{t("settings.actions.save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
