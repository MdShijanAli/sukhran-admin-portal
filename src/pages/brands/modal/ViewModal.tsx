import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Package, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Brand } from "@/lib/types";
import brandService from "@/services/brandService";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BaseModal } from "@/components/modals";
import TimeStaps from "@/components/custom/TimeStamps";

interface BrandDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  brandId: number | null;
}

interface ApiResponse {
  data: Brand;
}

export default function ViewModal({
  open,
  onClose,
  brandId,
}: BrandDetailsDialogProps) {
  const { t } = useTranslation();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      if (!brandId || !open) return;

      setIsLoading(true);
      try {
        const response = await brandService.fetchDetails(brandId);
        const apiResponse = response as unknown as ApiResponse;
        setBrand(apiResponse.data || (response as Brand));
      } catch (error) {
        console.error("Failed to fetch brand details:", error);
        toast.error(t("brands.messages.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandDetails();
  }, [brandId, open, t]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("brands.view.brandDetails")}
      size="2xl"
      showSubmitButton={false}
      loading={isLoading}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-2xl font-bold">{brand?.title}</h3>
              </div>
              <Badge variant={brand?.is_active ? "default" : "secondary"}>
                {brand?.is_active
                  ? t("brands.status.active")
                  : t("brands.status.inactive")}
              </Badge>
            </div>

            {brand?.image_url && (
              <div className="w-32 h-32 rounded-lg border overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={brand.image_url}
                  alt={brand.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {!brand?.image_url && (
            <div className="w-full h-48 rounded-lg border bg-muted flex items-center justify-center">
              <div className="text-center space-y-2">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {t("brands.view.noImage")}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {t("brands.view.description")}
            </h4>
            <p className="text-base leading-relaxed">{brand?.description}</p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {t("brands.view.displayOrder")}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-base">
                {brand?.display_order}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {t("brands.view.status")}
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  brand?.is_active ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="font-medium">
                {brand?.is_active
                  ? t("brands.status.active")
                  : t("brands.status.inactive")}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <TimeStaps item={brand} />
      </div>
    </BaseModal>
  );
}
