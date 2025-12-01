import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import settingsService from "@/services/settingsService";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscriptionSetting {
  id: number;
  key: string;
  value: string[] | Record<string, string> | number;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function SubscriptionTab() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Delivery Frequencies
  const [deliveryFrequencies, setDeliveryFrequencies] = useState<string[]>([]);
  const [newFrequency, setNewFrequency] = useState("");

  // Preferred Delivery Dates
  const [preferredDates, setPreferredDates] = useState<Record<string, string>>(
    {}
  );
  const [newDateKey, setNewDateKey] = useState("");
  const [newDateValue, setNewDateValue] = useState("");

  // Duration Options
  const [durationOptions, setDurationOptions] = useState<number[]>([]);
  const [newDuration, setNewDuration] = useState("");

  // Cancellation Notice Days
  const [cancellationDays, setCancellationDays] = useState<number>(7);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsService.getSubscriptionSettings();

      if (response && response.success && Array.isArray(response.data)) {
        response.data.forEach((setting) => {
          switch (setting.key) {
            case "delivery_frequencies":
              if (Array.isArray(setting.value)) {
                setDeliveryFrequencies(setting.value as string[]);
              }
              break;
            case "preferred_delivery_dates":
              if (
                typeof setting.value === "object" &&
                !Array.isArray(setting.value)
              ) {
                setPreferredDates(setting.value as Record<string, string>);
              }
              break;
            case "duration_options":
              if (Array.isArray(setting.value)) {
                setDurationOptions(setting.value.map(Number));
              }
              break;
            case "cancellation_notice_days":
              if (typeof setting.value === "number") {
                setCancellationDays(setting.value);
              }
              break;
          }
        });
      }
    } catch (error) {
      console.error("Error fetching subscription settings:", error);
      toast.error(t("settings.messages.fetchError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFrequencies = async () => {
    try {
      setIsSaving(true);
      await settingsService.updateDeliveryFrequencies(deliveryFrequencies);
      toast.success(t("settings.subscription.messages.frequenciesSaved"));
    } catch (error) {
      console.error("Error saving frequencies:", error);
      toast.error(t("settings.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferredDates = async () => {
    try {
      setIsSaving(true);
      await settingsService.updatePreferredDeliveryDates(preferredDates);
      toast.success(t("settings.subscription.messages.datesSaved"));
    } catch (error) {
      console.error("Error saving preferred dates:", error);
      toast.error(t("settings.messages.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const addFrequency = () => {
    if (
      newFrequency &&
      !deliveryFrequencies.includes(newFrequency.toLowerCase())
    ) {
      setDeliveryFrequencies([
        ...deliveryFrequencies,
        newFrequency.toLowerCase(),
      ]);
      setNewFrequency("");
    }
  };

  const removeFrequency = (frequency: string) => {
    setDeliveryFrequencies(deliveryFrequencies.filter((f) => f !== frequency));
  };

  const addPreferredDate = () => {
    if (newDateKey && newDateValue && !preferredDates[newDateKey]) {
      setPreferredDates({ ...preferredDates, [newDateKey]: newDateValue });
      setNewDateKey("");
      setNewDateValue("");
    }
  };

  const removePreferredDate = (key: string) => {
    const updated = { ...preferredDates };
    delete updated[key];
    setPreferredDates(updated);
  };

  const addDuration = () => {
    const duration = parseInt(newDuration);
    if (
      !isNaN(duration) &&
      duration > 0 &&
      !durationOptions.includes(duration)
    ) {
      setDurationOptions([...durationOptions, duration].sort((a, b) => a - b));
      setNewDuration("");
    }
  };

  const removeDuration = (duration: number) => {
    setDurationOptions(durationOptions.filter((d) => d !== duration));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Delivery Frequencies */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("settings.subscription.deliveryFrequencies.title")}
          </CardTitle>
          <CardDescription>
            {t("settings.subscription.deliveryFrequencies.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {deliveryFrequencies.map((frequency) => (
              <div
                key={frequency}
                className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-md"
              >
                <span className="text-sm capitalize">{frequency}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => removeFrequency(frequency)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder={t(
                "settings.subscription.deliveryFrequencies.addPlaceholder"
              )}
              value={newFrequency}
              onChange={(e) => setNewFrequency(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addFrequency()}
            />
            <Button onClick={addFrequency}>
              <Plus className="h-4 w-4 mr-2" />
              {t("settings.actions.add")}
            </Button>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveFrequencies} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {t("settings.actions.save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferred Delivery Dates */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("settings.subscription.preferredDates.title")}
          </CardTitle>
          <CardDescription>
            {t("settings.subscription.preferredDates.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {Object.entries(preferredDates).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-secondary rounded-md"
              >
                <div>
                  <p className="text-sm font-medium">{key}</p>
                  <p className="text-xs text-muted-foreground">{value}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePreferredDate(key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <Input
              placeholder={t(
                "settings.subscription.preferredDates.keyPlaceholder"
              )}
              value={newDateKey}
              onChange={(e) => setNewDateKey(e.target.value)}
            />
            <Input
              placeholder={t(
                "settings.subscription.preferredDates.valuePlaceholder"
              )}
              value={newDateValue}
              onChange={(e) => setNewDateValue(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <Button onClick={addPreferredDate} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {t("settings.actions.add")}
            </Button>
            <Button onClick={handleSavePreferredDates} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {t("settings.actions.save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Duration Options */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("settings.subscription.durationOptions.title")}
          </CardTitle>
          <CardDescription>
            {t("settings.subscription.durationOptions.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {durationOptions.map((duration) => (
              <div
                key={duration}
                className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-md"
              >
                <span className="text-sm">
                  {duration} {t("settings.subscription.durationOptions.months")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => removeDuration(duration)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={t(
                "settings.subscription.durationOptions.addPlaceholder"
              )}
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addDuration()}
            />
            <Button onClick={addDuration}>
              <Plus className="h-4 w-4 mr-2" />
              {t("settings.actions.add")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Notice */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.subscription.cancellation.title")}</CardTitle>
          <CardDescription>
            {t("settings.subscription.cancellation.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cancellationDays">
              {t("settings.subscription.cancellation.noticeDays")}
            </Label>
            <Input
              id="cancellationDays"
              type="number"
              value={cancellationDays}
              onChange={(e) =>
                setCancellationDays(parseInt(e.target.value) || 0)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
