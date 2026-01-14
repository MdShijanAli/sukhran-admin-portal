import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Banner } from "@/lib/types";
import { toast } from "sonner";
import bannerService from "@/services/bannerService";
import { formatDate } from "@/lib/utils";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Package,
  ShoppingCart,
  ExternalLink,
  User,
  Calendar,
} from "lucide-react";
import TimeStaps from "@/components/custom/TimeStamps";

interface ApiResponse {
  data: Banner;
}

interface BannerDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  bannerId: number | null;
}

export default function ViewModal({
  open,
  onClose,
  bannerId,
}: BannerDetailsDialogProps) {
  const { t } = useTranslation();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBannerDetails = async () => {
      if (!bannerId || !open) return;

      setIsLoading(true);
      try {
        const response = await bannerService.fetchDetails(bannerId);
        const apiResponse = response as unknown as ApiResponse;
        setBanner(apiResponse.data || (response as Banner));
      } catch (error) {
        console.error("Failed to fetch banner details:", error);
        toast.error(t("banners.messages.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerDetails();
  }, [bannerId, open, t]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("banners.view.bannerDetails")}
      size="3xl"
      showSubmitButton={false}
      loading={isLoading}
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{banner?.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  {t("banners.columns.displayOrder")}: {banner?.display_order}
                </span>
              </div>
            </div>
            <Badge variant={banner?.is_active ? "default" : "secondary"}>
              {banner?.is_active
                ? t("banners.status.active")
                : t("banners.status.inactive")}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Banner Image */}
        {banner?.image_url && (
          <>
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                {t("banners.form.image")}
              </h4>
              <div className="rounded-lg overflow-hidden border bg-muted">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Link Information */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            {t("banners.view.linkInformation")}
          </h4>

          <div className="grid gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t("banners.columns.linkType")}
              </p>
              <Badge variant="outline" className="font-medium">
                {t(`banners.linkTypes.${banner?.link_type}`)}
              </Badge>
            </div>

            {banner?.link_type === "none" && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  {t("banners.view.noLink")}
                </p>
              </div>
            )}

            {banner?.link_type === "url" && banner.url && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t("banners.form.url")}
                </p>
                <a
                  href={banner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline font-mono text-sm break-all"
                >
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  {banner.url}
                </a>
              </div>
            )}

            {banner?.link_type === "package" && banner.package && (
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-start gap-3">
                  {banner.package.image ? (
                    <img
                      src={banner.package.image}
                      alt={banner.package.name}
                      className="w-16 h-16 rounded-md object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md border bg-muted flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {t("banners.view.linksTo")}{" "}
                        {t("banners.linkTypes.package")}
                      </span>
                    </div>
                    <p className="font-semibold">{banner.package.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {banner.package_id}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {banner?.link_type === "product" && banner.product && (
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-start gap-3">
                  {banner.product.image ? (
                    <img
                      src={banner.product.image}
                      alt={banner.product.name}
                      className="w-16 h-16 rounded-md object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md border bg-muted flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {t("banners.view.linksTo")}{" "}
                        {t("banners.linkTypes.product")}
                      </span>
                    </div>
                    <p className="font-semibold">{banner.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {banner.product_id}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Creator Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <User className="h-4 w-4" />
              <p className="text-sm">{t("banners.view.createdBy")}</p>
            </div>
            <p className="font-medium">{banner?.created_by.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {banner?.created_at && formatDate(banner.created_at)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <User className="h-4 w-4" />
              <p className="text-sm">{t("banners.view.updatedBy")}</p>
            </div>
            {banner?.updated_by ? (
              <>
                <p className="font-medium">{banner.updated_by.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {banner.updated_at && formatDate(banner.updated_at)}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("banners.view.notUpdated")}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Timestamps */}
        <TimeStaps item={banner} />
      </div>
    </BaseModal>
  );
}
