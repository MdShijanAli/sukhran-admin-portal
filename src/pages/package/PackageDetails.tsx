import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "lucide-react";
import { toast } from "sonner";
import packageService from "@/services/packageService";
import { Package } from "@/lib/types";

export default function PackageDetails() {
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
      toast.error("Failed to load package details");
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
            Loading package details...
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
          <h3 className="mt-4 text-lg font-semibold">Package not found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            The package you're looking for doesn't exist
          </p>
          <Button className="mt-4" onClick={() => navigate("/packages")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Packages
          </Button>
        </div>
      </Card>
    );
  }

  const totalItems = packageData.items?.length || 0;
  const pricing = packageData.pricing || {
    originalPrice: 0,
    fixedPrice: packageData.fixedPrice || 0,
    discountPercent: packageData.discountPercent || 0,
    savings: 0,
  };
  const calculatedTotal = pricing.originalPrice || 0;
  const savings = pricing.savings || 0;

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
          <h1 className="text-3xl font-bold tracking-tight">Package Details</h1>
          <p className="text-muted-foreground mt-1">
            View complete package information
          </p>
        </div>
        <Button onClick={() => navigate(`/packages/edit/${packageData.id}`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Package
        </Button>
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
                    {packageData.description || "No description provided"}
                  </p>
                </div>
                <Badge variant={packageData.isActive ? "default" : "secondary"}>
                  {packageData.isActive ? "Active" : "Inactive"}
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
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-lg font-semibold capitalize">
                    {packageData.packageType}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Display Order</p>
                  <p className="text-lg font-semibold">
                    {packageData.displayOrder}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Items</p>
                  <p className="text-lg font-semibold">{totalItems}</p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Discount</p>
                  <p className="text-lg font-semibold text-green-600">
                    {pricing.discountPercent}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Items */}
          <Card>
            <CardHeader>
              <CardTitle>Package Items ({totalItems})</CardTitle>
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
                            <span className="text-muted-foreground">Unit:</span>
                            <Badge variant="outline">
                              {item.sku.unitSize} {item.sku.unitName}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Quantity:
                            </span>
                            <Badge variant="secondary">{item.quantity}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Item Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-muted-foreground">
                          ৳{item.price} × {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-primary mt-1">
                          ৳{item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PackageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    No items in this package
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {packageData.created_at && (
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">Created</span>
                    </div>
                    <p className="text-sm font-semibold">
                      {new Date(packageData.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(packageData.created_at).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                )}
                {packageData.updated_at && (
                  <div className="rounded-lg border bg-card p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">Last Updated</span>
                    </div>
                    <p className="text-sm font-semibold">
                      {new Date(packageData.updated_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(packageData.updated_at).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total Product Value:
                  </span>
                  <span className="font-medium">
                    ৳{calculatedTotal.toFixed(2)}
                  </span>
                </div>
                {pricing.discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="font-medium text-green-600">
                      {pricing.discountPercent}%
                    </span>
                  </div>
                )}
                {savings !== 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {savings > 0 ? "You Save:" : "Price Difference:"}
                    </span>
                    <span
                      className={`font-medium ${
                        savings > 0 ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      ৳{Math.abs(savings).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-base font-medium">Package Price:</span>
                <span className="text-2xl font-bold text-primary">
                  ৳{pricing.fixedPrice}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Package Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={packageData.isActive ? "default" : "secondary"}>
                  {packageData.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Featured:</span>
                <Badge variant={packageData.isFeatured ? "default" : "outline"}>
                  {packageData.isFeatured ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type:</span>
                <Badge variant="outline" className="capitalize">
                  {packageData.packageType}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
