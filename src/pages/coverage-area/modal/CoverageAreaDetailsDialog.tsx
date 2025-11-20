import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Circle, Loader2 } from "lucide-react";
import { CoverageArea } from "@/lib/types";
import coverageAreaService from "@/services/coverageAreaService";
import { toast } from "sonner";

interface CoverageAreaDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  areaId: number | null;
}

export function CoverageAreaDetailsDialog({
  open,
  onClose,
  areaId,
}: CoverageAreaDetailsDialogProps) {
  const [area, setArea] = useState<CoverageArea | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAreaDetails = async () => {
      if (!areaId || !open) return;

      setIsLoading(true);
      try {
        const response = await coverageAreaService.fetchDetails(areaId);
        const areaData =
          (response as { data?: CoverageArea })?.data || response;
        setArea(areaData as CoverageArea);
      } catch (error) {
        console.error("Failed to fetch coverage area details:", error);
        toast.error("Failed to load coverage area details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreaDetails();
  }, [areaId, open]);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!area) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Coverage Area Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{area.name}</h3>
              <Badge variant={area.is_active ? "default" : "secondary"}>
                {area.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{area.city}</p>
          </div>

          <Separator />

          {/* Location Details */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location Information
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Latitude</p>
                <p className="font-mono">{area.latitude}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Longitude</p>
                <p className="font-mono">{area.longitude}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Coverage Info */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Circle className="h-4 w-4" />
              Coverage Information
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Coverage Radius</p>
              <p className="text-lg font-semibold">{area.radius_km} km</p>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timestamps
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="text-sm">
                  {new Date(area.created_at).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Updated At</p>
                <p className="text-sm">
                  {new Date(area.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
