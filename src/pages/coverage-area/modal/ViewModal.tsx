import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Circle, Home, Users } from "lucide-react";
import { CoverageArea } from "@/lib/types";
import coverageAreaService from "@/services/coverageAreaService";
import { toast } from "sonner";
import TimeStaps from "@/components/custom/TimeStamps";

interface Address {
  id: number;
  user_id: number;
  coverage_area_id: number;
  house: string;
  road: string;
  block: string;
  zip_code: string;
  category: string;
  label: string | null;
  landmark: string | null;
  latitude: string | null;
  longitude: string | null;
  location_source: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface CoverageAreaDetails extends CoverageArea {
  custom_route_id?: string;
  addresses_count?: number;
  addresses?: Address[];
}

interface ApiResponse {
  data: CoverageAreaDetails;
}

interface CoverageAreaDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  areaId: number | null;
}

export default function ViewModal({
  open,
  onClose,
  areaId,
}: CoverageAreaDetailsDialogProps) {
  const { t } = useTranslation();
  const [area, setArea] = useState<CoverageAreaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAreaDetails = async () => {
      if (!areaId || !open) return;

      setIsLoading(true);
      try {
        const response = await coverageAreaService.fetchDetails(areaId);
        const apiResponse = response as unknown as ApiResponse;
        setArea(apiResponse.data || (response as CoverageAreaDetails));
      } catch (error) {
        console.error("Failed to fetch coverage area details:", error);
        toast.error(t("coverage_area.messages.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreaDetails();
  }, [areaId, open]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("coverage_area.view.coverageAreaDetails")}
      size="2xl"
      showSubmitButton={false}
      loading={isLoading}
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl ">{area?.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <p>{area?.city}</p>
                {area?.custom_route_id && (
                  <>
                    <span>•</span>
                    <p className="text-sm">
                      {t("coverage_area.view.routeId")}: {area.custom_route_id}
                    </p>
                  </>
                )}
              </div>
            </div>
            <Badge variant={area?.is_active ? "default" : "secondary"}>
              {area?.is_active
                ? t("coverage_area.status.active")
                : t("coverage_area.status.inactive")}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">
                {t("coverage_area.view.addresses")}
              </span>
            </div>
            <p className="text-2xl ">{area?.addresses_count || 0}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Circle className="h-4 w-4" />
              <span className="text-sm">
                {t("coverage_area.view.coverageRadius")}
              </span>
            </div>
            <p className="text-2xl ">{area?.radius_km} km</p>
          </div>
        </div>

        <Separator />

        {/* Location Details */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t("coverage_area.view.locationInformation")}
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t("coverage_area.view.latitude")}
              </p>
              <p className="font-mono">{area?.latitude}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t("coverage_area.view.longitude")}
              </p>
              <p className="font-mono">{area?.longitude}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Addresses List */}
        {area?.addresses && area.addresses.length > 0 && (
          <>
            <div>
              <h4 className="mb-3 font-semibold flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t("coverage_area.view.addresses")} ({area.addresses.length})
              </h4>
              <div className="space-y-3">
                {area.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold">{address.house}</h5>
                          {address.is_default && (
                            <Badge variant="default" className="text-xs">
                              {t("coverage_area.view.default")}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {address.category}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            {t("coverage_area.view.road")} {address.road},{" "}
                            {t("coverage_area.view.block")} {address.block}
                          </p>
                          <p>
                            {t("coverage_area.view.zipCode")} {address.zip_code}
                          </p>
                          {address.landmark && (
                            <p>
                              {t("coverage_area.view.landmark")}{" "}
                              {address.landmark}
                            </p>
                          )}
                          {address.label && (
                            <p>
                              {t("coverage_area.view.label")} {address.label}
                            </p>
                          )}
                          {address.latitude && address.longitude && (
                            <p className="font-mono text-xs">
                              {t("coverage_area.view.coordinates")}:{" "}
                              {address.latitude}, {address.longitude}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                          <span>
                            {t("coverage_area.view.userId")} {address.user_id}
                          </span>
                          <span>•</span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {address.location_source}
                          </Badge>
                          <span>•</span>
                          <span>
                            {t("coverage_area.view.added")}{" "}
                            {new Date(address.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {area?.addresses && area.addresses.length === 0 && (
          <>
            <div className="text-center py-6 text-muted-foreground">
              <Home className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {t("coverage_area.view.noAddressesFound")}
              </p>
            </div>
            <Separator />
          </>
        )}

        {/* Timestamps */}
        <TimeStaps item={area} />
      </div>
    </BaseModal>
  );
}
