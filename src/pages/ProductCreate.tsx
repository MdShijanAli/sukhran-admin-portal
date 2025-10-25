import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Variant {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
}

export default function ProductCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', size: '', color: '', price: 0, stock: 0 },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: Date.now().toString(), size: '', color: '', price: 0, stock: 0 },
    ]);
  };

  const removeVariant = (id: string) => {
    if (variants.length > 1) {
      setVariants(variants.filter((v) => v.id !== id));
    }
  };

  const updateVariant = (id: string, field: keyof Variant, value: string | number) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle product creation
    navigate('/products');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          {t('productCreate.title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('productCreate.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('productCreate.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="productName">{t('productCreate.productName')}</Label>
              <Input
                id="productName"
                placeholder={t('productCreate.productNamePlaceholder')}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">{t('productCreate.category')}</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder={t('productCreate.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dairy">{t('productCreate.dairy')}</SelectItem>
                  <SelectItem value="eggs">{t('productCreate.eggs')}</SelectItem>
                  <SelectItem value="beverages">{t('productCreate.beverages')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="unit">{t('productCreate.unit')}</Label>
              <Input
                id="unit"
                placeholder={t('productCreate.unitPlaceholder')}
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">{t('productCreate.description')}</Label>
              <Textarea
                id="description"
                placeholder={t('productCreate.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label>{t('productCreate.productImage')}</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t('productCreate.uploadImage')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('productCreate.variants')}</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-1" />
              {t('productCreate.addVariant')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="border rounded-lg p-4 space-y-4 relative"
              >
                {variants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeVariant(variant.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}

                <h4 className="font-medium">
                  {t('productCreate.variant')} {index + 1}
                </h4>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`size-${variant.id}`}>
                      {t('productCreate.size')}
                    </Label>
                    <Input
                      id={`size-${variant.id}`}
                      placeholder="e.g., 1L, 500g, Small"
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(variant.id, 'size', e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`color-${variant.id}`}>
                      {t('productCreate.color')}
                    </Label>
                    <Input
                      id={`color-${variant.id}`}
                      placeholder="e.g., White, Brown"
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(variant.id, 'color', e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`price-${variant.id}`}>
                      {t('productCreate.price')}
                    </Label>
                    <Input
                      id={`price-${variant.id}`}
                      type="number"
                      placeholder="0"
                      value={variant.price || ''}
                      onChange={(e) =>
                        updateVariant(variant.id, 'price', Number(e.target.value))
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`stock-${variant.id}`}>
                      {t('productCreate.stock')}
                    </Label>
                    <Input
                      id={`stock-${variant.id}`}
                      type="number"
                      placeholder="0"
                      value={variant.stock || ''}
                      onChange={(e) =>
                        updateVariant(variant.id, 'stock', Number(e.target.value))
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit">{t('productCreate.createProduct')}</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/products')}
          >
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}
