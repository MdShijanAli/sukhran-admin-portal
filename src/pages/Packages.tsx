import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Package as PackageIcon } from "lucide-react";
import { usePackageStore } from "@/stores/packageStore";
import { toast } from "@/hooks/use-toast";

export default function Packages() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { packages, deletePackage } = usePackageStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPackageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (packageToDelete) {
      deletePackage(packageToDelete);
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      setPackageToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            {t("packages.title")}
          </h1>
          <p className="text-muted-foreground mt-2">{t("packages.subtitle")}</p>
        </div>
        <Button onClick={() => navigate("/packages/create")}>
          <Plus className="h-4 w-4 mr-2" />
          {t("packages.createPackage")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <PackageIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                </div>
                <Badge
                  variant={pkg.status === "active" ? "default" : "secondary"}
                >
                  {pkg.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t("packages.products")}:
                </p>
                <ul className="text-sm space-y-1">
                  {pkg.products.map((product, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {product}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                    ৳{pkg.price}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {pkg.frequency}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{pkg.subscribers}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("packages.subscribers")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/packages/edit/${pkg.id}`)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {t("common.edit")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(pkg.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              package and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
