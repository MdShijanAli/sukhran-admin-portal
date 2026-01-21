import { Package } from "@/stores/packageStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package as PackageIcon, Calendar, Gift, Users } from "lucide-react";

interface PackagePreviewProps {
  package: Package;
}

export default function PackagePreview({ package: pkg }: PackagePreviewProps) {
  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-4">
        {pkg.photo && (
          <div className="w-full h-48 rounded-lg overflow-hidden bg-muted">
            <img
              src={pkg.photo}
              alt={pkg.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{pkg.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PackageIcon className="h-4 w-4" />
              <span className="capitalize">{pkg.type} Package</span>
            </div>
          </div>
          <Badge variant={pkg.status === "active" ? "default" : "secondary"}>
            {pkg.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">{pkg.description}</p>

        <div className="grid grid-cols-3 gap-4 py-4 border-y">
          <div className="text-center">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Frequency</p>
            <p className="text-sm font-medium capitalize">{pkg.frequency}</p>
          </div>
          <div className="text-center">
            <PackageIcon className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Size</p>
            <p className="text-sm font-medium capitalize">{pkg.size}</p>
          </div>
          <div className="text-center">
            <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Subscribers</p>
            <p className="text-sm font-medium">{pkg.subscribers}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Included Products:</p>
          <ul className="space-y-2">
            {pkg.products.map((product, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {product}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Price</span>
            <span className="text-3xl  gradient-primary bg-clip-text text-transparent">
              ৳{pkg.price}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Gift className="h-4 w-4" />
              Redeem Coins
            </span>
            <span className="font-medium text-primary">
              {pkg.redeemCoins} coins
            </span>
          </div>
        </div>

        <Button className="w-full" size="lg">
          Subscribe Now
        </Button>
      </CardContent>
    </Card>
  );
}
