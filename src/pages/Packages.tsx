import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Package as PackageIcon } from 'lucide-react';
import { subscriptionPackages, products } from '@/data/mockData';

export default function Packages() {
  const { t } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [packageName, setPackageName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [priceAdjustment, setPriceAdjustment] = useState(0);

  const calculateTotalPrice = () => {
    const basePrice = products
      .filter((p) => selectedProducts.includes(p.id))
      .reduce((sum, p) => sum + p.price, 0);
    return basePrice + priceAdjustment;
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            {t('packages.title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('packages.subtitle')}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('packages.createPackage')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('packages.createPackage')}</DialogTitle>
              <DialogDescription>{t('packages.createPackageDesc')}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="packageName">{t('packages.packageName')}</Label>
                <Input
                  id="packageName"
                  placeholder={t('packages.packageNamePlaceholder')}
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="frequency">{t('packages.frequency')}</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t('packages.daily')}</SelectItem>
                    <SelectItem value="weekly">{t('packages.weekly')}</SelectItem>
                    <SelectItem value="monthly">{t('packages.monthly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>{t('packages.selectProducts')}</Label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={product.id}
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleProductToggle(product.id)}
                      />
                      <label
                        htmlFor={product.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                      >
                        {product.name} - ৳{product.price}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priceAdjustment">{t('packages.priceAdjustment')}</Label>
                <Input
                  id="priceAdjustment"
                  type="number"
                  placeholder="0"
                  value={priceAdjustment}
                  onChange={(e) => setPriceAdjustment(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  {t('packages.priceAdjustmentDesc')}
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('packages.totalPrice')}:</span>
                  <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                    ৳{calculateTotalPrice()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedProducts.length} {t('packages.productsSelected')}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline">{t('common.cancel')}</Button>
              <Button>{t('common.save')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subscriptionPackages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <PackageIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                </div>
                <Badge variant={pkg.status === 'active' ? 'default' : 'secondary'}>
                  {pkg.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('packages.products')}:</p>
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
                  <p className="text-xs text-muted-foreground">{t('packages.subscribers')}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  {t('common.edit')}
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
