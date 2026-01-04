import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  RefreshCw,
  Package as PackageIcon,
  Edit,
  Trash2,
  Eye,
  X,
  Coins,
} from "lucide-react";
import { toast } from "sonner";
import { usePackageStore } from "@/stores/packageStore";
import packageService from "@/services/packageService";
import DeleteModal from "@/components/modals/DeleteModal";
import { Package } from "@/lib/types";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Pagination } from "@/components/table/Pagination";
import ShareButton from "@/components/custom/ShareButton";
import { formatNumberWithCommas } from "@/lib/utils";
import permissions from "@/lib/permissions";
import { withPermission } from "@/hoc/withPermission";
import usePermissions from "@/hooks/use-permissions";

function Packages() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const store = usePackageStore();
  const { hasPermission } = usePermissions();

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentPage = store.pagination?.current_page || 1;
  const perPage = store.pagination?.per_page || 20;
  const { isCollapsed } = useSidebarStore();

  // Get data from store
  const packages = store.packages || [];
  const pagination = store.pagination;
  const isLoading = store.isLoading || false;
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const fetchPackages = useCallback(
    async (forceFetch = false) => {
      if (
        !forceFetch &&
        packages.length > 0 &&
        !hasInitialFetch &&
        isFirstRender
      ) {
        console.log("Using cached data from store, skipping API call");
        setHasInitialFetch(true);
        return;
      }
      try {
        store.setLoading?.(true);
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append("search", searchQuery);
        }
        params.append("packageType", "admin");
        params.append("page", currentPage.toString());
        params.append("per_page", perPage.toString());
        await packageService.fetchLists(params.toString());
        if (!hasInitialFetch) {
          setHasInitialFetch(true);
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        toast.error(t("packages.messages.failedToLoad"));
      } finally {
        store.setLoading?.(false);
      }
    },
    [
      searchQuery,
      isFirstRender,
      hasInitialFetch,
      packages.length,
      perPage,
      currentPage,
    ]
  );

  // Fetch on mount and when dependencies change
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      fetchPackages();
    }
  }, [isFirstRender]);

  // Handle search with debounce
  useEffect(() => {
    if (isFirstRender) return; // Skip debounce on first render

    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        store.setPagination?.({
          ...store.pagination,
          current_page: 1,
        });
      } else {
        fetchPackages();
      }
    }, 500);

    return () => clearTimeout(timer);
    // Only run when searchQuery changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Handle filter, page, and perPage changes
  useEffect(() => {
    if (isFirstRender) return; // Skip on first render
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPackages(true);
    setIsRefreshing(false);
  };

  const handleEdit = (pkg: Package) => {
    navigate(`/packages/edit/${pkg.id}`);
  };

  const handleView = (pkg: Package) => {
    navigate(`/packages/view/${pkg.id}`);
  };

  const handleDelete = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedPackage) return;
    setIsDeleting(true);
    try {
      await packageService.deleteItem(selectedPackage.id);
      toast.success(t("packages.messages.packageDeleted"));
      await fetchPackages(currentPage);
      setShowDelete(false);
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error(t("packages.messages.failedToDelete"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <Card className="mb-3">
        <CardContent className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("packages.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("packages.subtitle")}
            </p>
          </div>
          <div className="flex gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("packages.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            {hasPermission(permissions.packages.create) && (
              <Button
                className="gap-2"
                onClick={() => navigate("/packages/create")}
              >
                <Plus className="h-4 w-4" />
                {t("packages.addPackage")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Packages Grid */}
      <div>
        {isLoading ? (
          <div
            className={`grid grid-cols-2 gap-3 ${
              isCollapsed
                ? "2xl:grid-cols-6 xl:grid-cols-5 sm:grid-cols-3 lg:grid-cols-4"
                : "2xl:grid-cols-5 xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <PackageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                {t("packages.noPackagesFound")}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {t("packages.getStarted")}
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/packages/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("packages.createPackage")}
              </Button>
            </div>
          </Card>
        ) : (
          <div
            className={`grid grid-cols-2 gap-3 ${
              isCollapsed
                ? "2xl:grid-cols-6 xl:grid-cols-5 sm:grid-cols-3 lg:grid-cols-4"
                : "2xl:grid-cols-5 xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {packages.map((pkg) => {
              const pricing = pkg.pricing || {
                originalPrice: 0,
                fixedPrice: pkg.fixedPrice || 0,
                discountPercent: pkg.discountPercent || 0,
                savings: 0,
                currentPrice: 0,
              };

              return (
                <Card
                  key={pkg.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Package Image */}
                  <div className="aspect-video relative bg-muted">
                    {pkg.image_url || pkg.imgUrl ? (
                      <img
                        src={pkg.image_url || pkg.imgUrl || ""}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PackageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {/* Status Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge
                        variant={pkg.isActive ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {pkg.isActive
                          ? t("packages.status.active")
                          : t("packages.status.inactive")}
                      </Badge>
                      {pkg.isFeatured && (
                        <Badge className="text-[10px] px-1.5 py-0">
                          {t("packages.status.featured")}
                        </Badge>
                      )}
                      {pkg.badge && (
                        <Badge
                          variant="primary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {pkg.badge}
                        </Badge>
                      )}
                    </div>
                    {/* Type Badge */}
                    <Badge
                      variant="outline"
                      className="absolute top-2 right-2 text-[10px] px-1.5 py-0 capitalize bg-background/80"
                    >
                      {pkg.packageType}
                    </Badge>
                  </div>

                  <CardContent className="p-3">
                    <div className="space-y-2">
                      {/* Package Name */}
                      <h3 className="font-semibold text-sm line-clamp-2 min-h-[1rem]">
                        {pkg.name}
                      </h3>

                      {/* Price Section */}
                      <div className="pt-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {pricing.fixedPrice !== pricing.currentPrice &&
                            pricing.fixedPrice > 0 && (
                              <p className="text-sm text-muted-foreground line-through">
                                ৳{formatNumberWithCommas(pricing.fixedPrice)}
                              </p>
                            )}
                          {pricing.discountPercent > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] px-1.5 py-0 h-4"
                            >
                              {pricing.discountPercent}% OFF
                            </Badge>
                          )}
                          {pkg.coinsReward > 0 && (
                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <Coins className="h-4 w-4" />
                              {pkg.coinsReward}
                            </span>
                          )}
                        </div>
                        <p className="text-xl font-bold text-green-600">
                          ৳
                          {pricing.currentPrice
                            ? formatNumberWithCommas(pricing.currentPrice)
                            : formatNumberWithCommas(pricing.fixedPrice)}
                        </p>
                        {pricing.savings > 0 && (
                          <p className="text-xs text-green-600 font-medium">
                            You save ৳{formatNumberWithCommas(pricing.savings)}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(pkg)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {/* <ShareButton
                          url={`${window.location.origin}/packages/view/${pkg.id}`}
                          title={`Check out ${pkg.name}`}
                          description={
                            pkg.description || "Amazing package deal!"
                          }
                          price={pricing.fixedPrice}
                          variant="outline"
                          size="sm"
                          iconOnly
                          className="flex-1 h-8 text-xs"
                        /> */}
                        {hasPermission(permissions.packages.edit) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(pkg)}
                            className="flex-1 h-8 text-xs"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        ️
                        {hasPermission(permissions.packages.delete) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pkg)}
                            className="flex-1 h-8 text-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading &&
        packages.length > 0 &&
        pagination &&
        pagination.last_page > 1 && (
          <Card className="mt-3">
            <CardContent className="p-0">
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
                totalItems={pagination.total}
                itemsPerPage={pagination.per_page}
                store={store}
              />
            </CardContent>
          </Card>
        )}

      {/* Delete Package Modal */}
      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={t("packages.delete.title")}
        description={`${t("deleteConfirm")} "${selectedPackage?.name}"? ${t(
          "deleteAftermath"
        )}`}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default withPermission(Packages, permissions.packages.view);
