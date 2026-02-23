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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import TimeStaps from "@/components/custom/TimeStamps";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

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
              <h3 className="text-2xl ">{banner?.title}</h3>
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
              <h4 className=" flex items-center gap-2">
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
          <h4 className=" flex items-center gap-2">
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

            {banner?.link_type === "package" && (banner as any)?.packages && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>
                      {t("banners.view.linksTo")}{" "}
                      {(banner as any).packages.length}{" "}
                      {(banner as any).packages.length === 1
                        ? t("banners.linkTypes.package")
                        : "Packages"}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {(banner as any).packages.length} items
                  </Badge>
                </div>
                <div className="space-y-3">
                  {(banner as any).packages.map((pkg: any, index: number) => (
                    <Collapsible key={pkg.id} defaultOpen={index === 0}>
                      <div className="rounded-lg border bg-card overflow-hidden">
                        {/* Package Header */}
                        <div className="p-3 bg-muted/30">
                          <div className="flex items-start gap-3">
                            {pkg.image_url ? (
                              <img
                                src={pkg.image_url}
                                alt={pkg.name}
                                className="w-16 h-16 rounded-md object-cover border flex-shrink-0"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-md border bg-muted flex items-center justify-center flex-shrink-0">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className=" text-base mb-1">
                                    {pkg.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    ID: {pkg.id} • {pkg.packageType}
                                  </p>
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <div>
                                      <span className="text-lg  text-primary">
                                        ৳{pkg.pricing?.currentPrice}
                                      </span>
                                      {pkg.pricing?.totalItemsPrice !==
                                        pkg.pricing?.currentPrice && (
                                          <span className="text-xs text-muted-foreground line-through ml-2">
                                            ৳{pkg.pricing?.totalItemsPrice}
                                          </span>
                                        )}
                                    </div>
                                    {pkg.pricing?.savings > 0 && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs"
                                      >
                                        Save ৳{pkg.pricing.savings}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                                  </Button>
                                </CollapsibleTrigger>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Package Items */}
                        <CollapsibleContent>
                          <div className="p-3 pt-2 space-y-2">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-muted-foreground">
                                Package Items ({pkg.totalItems})
                              </p>
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                              {pkg.items?.map((item: any) => (
                                <div
                                  key={item.id}
                                  className="flex items-start gap-3 p-2 rounded-md bg-muted/40 hover:bg-muted/60 transition-colors"
                                >
                                  <img
                                    src={
                                      item.sku?.image_url ||
                                      item.product?.image_url ||
                                      "/placeholder-product.png"
                                    }
                                    alt={item.product?.name}
                                    className="w-12 h-12 rounded object-cover border flex-shrink-0"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">
                                      {item.product?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {item.sku?.name} • {item.sku?.unitSize}
                                      {item.sku?.unitName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Qty: {item.quantity}
                                      </Badge>
                                      <span className="text-xs ">
                                        ৳{item.subtotal}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}

            {banner?.link_type === "product" && (banner as any)?.products && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      {t("banners.view.linksTo")}{" "}
                      {(banner as any).products.length}{" "}
                      {(banner as any).products.length === 1
                        ? t("banners.linkTypes.product")
                        : "Products"}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {(banner as any).products.length} items
                  </Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {(banner as any).products.map((product: any) => (
                    <div
                      key={product.id}
                      className="rounded-lg border bg-card p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-14 h-14 rounded-md object-cover border flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-md border bg-muted flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className=" text-sm truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            {product.category?.name}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {product.badge && (
                              <Badge variant="outline" className="text-xs">
                                {product.badgeLabel}
                              </Badge>
                            )}
                            {product.pricing?.currentPrice && (
                              <span className="text-xs  text-primary">
                                ৳{product.pricing.currentPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
