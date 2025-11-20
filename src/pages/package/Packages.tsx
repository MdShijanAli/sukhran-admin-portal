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
} from "lucide-react";
import { toast } from "sonner";
import { usePackageStore } from "@/stores/packageStore";
import packageService from "@/services/packageService";
import DeleteModal from "@/components/modals/DeleteModal";
import { Package } from "@/lib/types";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Pagination } from "@/components/table/Pagination";

export default function Packages() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const store = usePackageStore();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { isCollapsed } = useSidebarStore();

  // Get data from store
  const packages = store.packages || [];
  const pagination = store.pagination;
  const isLoading = store.isLoading || false;

  const fetchPackages = useCallback(
    async (page = 1) => {
      try {
        store.setLoading?.(true);
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append("search", searchQuery);
        }
        params.append("page", page.toString());
        await packageService.fetchLists(params.toString());
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        toast.error("Failed to load packages");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [searchQuery]
  );

  // Fetch packages on mount and page change
  useEffect(() => {
    fetchPackages(currentPage);
  }, [fetchPackages, currentPage]);

  // Debounced search - reset to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchPackages(1);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPackages(currentPage);
    setIsRefreshing(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      toast.success("Package deleted successfully");
      await fetchPackages(currentPage);
      setShowDelete(false);
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
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
              Manage subscription packages and bundles
            </p>
          </div>
          <div className="flex gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search packages..."
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
            <Button
              className="gap-2"
              onClick={() => navigate("/packages/create")}
            >
              <Plus className="h-4 w-4" />
              Add Package
            </Button>
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
                <div className="aspect-square bg-muted" />
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
              <h3 className="mt-4 text-lg font-semibold">No packages found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Get started by creating your first package
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/packages/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Package
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
              const totalItems = pkg.items?.length || 0;
              const calculatedTotal = pkg.items?.reduce(
                (sum, item) => sum + item.subtotal,
                0
              );

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
                        {pkg.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {pkg.isFeatured && (
                        <Badge className="text-[10px] px-1.5 py-0">
                          Featured
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
                      <h3 className="font-semibold text-sm line-clamp-2 min-h-[2rem]">
                        {pkg.name}
                      </h3>

                      {/* Package Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{totalItems} Items</span>
                        {pkg.discountPercent > 0 && (
                          <span className="text-green-600 font-medium">
                            {pkg.discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Price Section */}
                      <div className="pt-1">
                        {calculatedTotal &&
                          calculatedTotal > pkg.fixedPrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              ৳{calculatedTotal.toFixed(2)}
                            </p>
                          )}
                        <p className="text-lg font-bold text-primary">
                          ৳{pkg.fixedPrice}
                        </p>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pkg)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pkg)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
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
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        )}

      {/* Delete Package Modal */}
      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Package"
        description={`Are you sure you want to delete "${selectedPackage?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
