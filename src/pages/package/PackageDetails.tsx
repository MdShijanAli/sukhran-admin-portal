import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Loader2,
  Package as PackageIcon,
  Calendar,
  Coins,
} from "lucide-react";
import { toast } from "sonner";
import packageService from "@/services/packageService";
import { Package } from "@/lib/types";
import ShareButton from "@/components/custom/ShareButton";
import { formatNumberWithCommas } from "@/lib/utils";
import TimeStaps from "@/components/custom/TimeStamps";

export default function PackageDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPackageDetails(id);
    }
  }, [id]);

  const fetchPackageDetails = async (packageId: string) => {
    setIsLoading(true);
    try {
      const result = await packageService.fetchDetails(packageId);
      const data = (result as { data?: Package })?.data || (result as Package);
      setPackageData(data);
    } catch (error) {
      console.error("Error fetching package details:", error);
      toast.error(t("packages.messages.failedToLoadDetails"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            {t("packages.loadingPackageDetails")}
          </p>
        </div>
      </Card>
    );
  }

  if (!packageData) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <PackageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            {t("packages.packageNotFound")}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {t("packages.packageNotFoundDesc")}
          </p>
          <Button className="mt-4" onClick={() => navigate("/packages")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("packages.backToPackages")}
          </Button>
        </div>
      </Card>
    );
  }

  const totalItems = packageData.items?.length || 0;

  // Handle both new and old pricing structures
  const pricing = packageData.pricing || {
    totalItemsPrice: 0,
    fixedPrice: packageData.fixedPrice || 0,
    discountPercent: packageData.discountPercent || 0,
    calculatedDiscountPercent: 0,
    savings: 0,
  };

  const totalItemsPrice = pricing.totalItemsPrice || 0;
  const fixedPrice = pricing.fixedPrice || 0;
  const discountPercent = pricing.discountPercent || 0;
  const calculatedDiscountPercent = pricing.calculatedDiscountPercent || 0;
  const savings = pricing.savings || 0;

  // Calculate final price based on fixed price and discount
  const basePrice = fixedPrice > 0 ? fixedPrice : totalItemsPrice;
  const finalPrice =
    discountPercent > 0
      ? basePrice - (basePrice * discountPercent) / 100
      : basePrice;

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/packages")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("packages.view.packageDetails")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("packages.view.viewCompleteInfo")}
          </p>
        </div>
        {/* <div className="flex gap-2">
          <ShareButton
            title={`${t("packages.view.checkOut")} ${packageData.name}`}
            description={
              packageData.description || t("packages.view.amazingPackageDeal")
            }
            price={finalPrice}
          />
          <Button onClick={() => navigate(`/packages/edit/${packageData.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            {t("packages.view.editPackage")}
          </Button>
        </div> */}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-3">
          {/* Package Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl">{packageData.name}</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    {packageData.description ||
                      t("packages.view.noDescription")}
                  </p>
                </div>
                <Badge variant={packageData.isActive ? "default" : "secondary"}>
                  {packageData.isActive
                    ? t("packages.status.active")
                    : t("packages.status.inactive")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Package Image */}
              {(packageData.image_url || packageData.imgUrl) && (
                <div className="mb-4">
                  <img
                    src={packageData.image_url || packageData.imgUrl || ""}
                    alt={packageData.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("packages.view.type")}
                  </p>
                  <p className="text-lg font-semibold capitalize">
                    {t(`packages.type.${packageData.packageType}`)}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("packages.view.displayOrder")}
                  </p>
                  <p className="text-lg font-semibold">
                    {packageData.displayOrder}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("packages.view.items")}
                  </p>
                  <p className="text-lg font-semibold">
                    {formatNumberWithCommas(totalItems, { minDigit: 0 })}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("packages.view.discount")}
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {discountPercent}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Items */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("packages.view.packageItems")} ({totalItems})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {packageData.items && packageData.items.length > 0 ? (
                <div className="space-y-3">
                  {packageData.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 rounded-lg border hover:shadow-sm transition-shadow"
                    >
                      {/* Item Image */}
                      <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {item.sku.image_url || item.sku.imgUrl ? (
                          <img
                            src={item.sku.image_url || item.sku.imgUrl || ""}
                            alt={item.sku.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <PackageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.sku.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {t("packages.view.unit")}
                            </span>
                            <Badge variant="outline">
                              {formatNumberWithCommas(item.sku.unitSize, {
                                minDigit: 0,
                              })}{" "}
                              {item.sku.unitName}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {t("packages.view.quantity")}
                            </span>
                            <Badge variant="secondary">
                              {formatNumberWithCommas(item.quantity, {
                                minDigit: 0,
                              })}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Item Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-muted-foreground">
                          ৳{item.price} × {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-primary mt-1">
                          ৳{formatNumberWithCommas(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PackageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("packages.view.noItemsInPackage")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>{t("packages.view.packageInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
              {packageData.updated_at && <TimeStaps item={packageData} />}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t("packages.view.pricingSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("packages.view.totalItemsValue")}
                  </span>
                  <span className="font-medium">
                    ৳{formatNumberWithCommas(totalItemsPrice)}
                  </span>
                </div>
                {fixedPrice > 0 && fixedPrice !== totalItemsPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("packages.view.fixedPrice")}
                    </span>
                    <span className="font-medium text-primary">
                      ৳{formatNumberWithCommas(fixedPrice)}
                    </span>
                  </div>
                )}
                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("packages.view.discountLabel")}
                    </span>
                    <span className="font-medium text-orange-600">
                      {discountPercent}%
                    </span>
                  </div>
                )}
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("packages.view.youSave")}
                    </span>
                    <span className="font-medium text-green-600">
                      ৳{formatNumberWithCommas(savings)}
                    </span>
                  </div>
                )}
                {calculatedDiscountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("packages.view.effectiveDiscount")}
                    </span>
                    <span className="font-medium text-green-600">
                      {calculatedDiscountPercent.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-base font-medium">
                  {t("packages.view.finalPrice")}
                </span>
                <span className="text-2xl font-bold text-primary">
                  ৳{formatNumberWithCommas(finalPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800">
                <span className="text-base font-medium flex items-center gap-2">
                  {t("packages.view.coinsReward")}
                </span>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Coins className="h-5 w-5" />
                  {packageData.coinsReward}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Package Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t("packages.view.statusAndFeatures")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("packages.view.status")}
                </span>
                <Badge variant={packageData.isActive ? "default" : "secondary"}>
                  {packageData.isActive
                    ? t("packages.status.active")
                    : t("packages.status.inactive")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("packages.view.featured")}
                </span>
                <Badge variant={packageData.isFeatured ? "default" : "outline"}>
                  {packageData.isFeatured
                    ? t("packages.view.yes")
                    : t("packages.view.no")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("packages.view.typeLabel")}
                </span>
                <Badge variant="outline" className="capitalize">
                  {t(`packages.type.${packageData.packageType}`)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
