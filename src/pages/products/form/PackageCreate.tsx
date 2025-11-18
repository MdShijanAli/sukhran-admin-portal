import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload, Plus, X, Save } from 'lucide-react';
import { products } from '@/data/mockData';
import { usePackageStore } from '@/stores/packageStore';
import { toast } from '@/hooks/use-toast';

export default function PackageCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addPackage, updatePackage, getPackageById } = usePackageStore();
  
  const isEditMode = !!id;
  const existingPackage = isEditMode ? getPackageById(id) : null;
  
  const [formData, setFormData] = useState({
    name: existingPackage?.name || '',
    type: existingPackage?.type || 'individual',
    frequency: existingPackage?.frequency || 'daily',
    size: existingPackage?.size || 'small',
    description: existingPackage?.description || '',
    photo: existingPackage?.photo || '',
    status: existingPackage?.status || 'active' as 'active' | 'inactive' | 'draft',
  });
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>(existingPackage?.products || []);
  const [customPrice, setCustomPrice] = useState<string>(existingPackage?.price.toString() || '');
  const [customCoins, setCustomCoins] = useState<string>(existingPackage?.redeemCoins.toString() || '');
  const [imagePreview, setImagePreview] = useState<string>(existingPackage?.photo || '');

  // Load existing package data when in edit mode
  useEffect(() => {
    if (isEditMode && existingPackage) {
      setFormData({
        name: existingPackage.name,
        type: existingPackage.type,
        frequency: existingPackage.frequency,
        size: existingPackage.size,
        description: existingPackage.description,
        photo: existingPackage.photo,
        status: existingPackage.status,
      });
      setSelectedProducts(existingPackage.products);
      setCustomPrice(existingPackage.price.toString());
      setCustomCoins(existingPackage.redeemCoins.toString());
      setImagePreview(existingPackage.photo);
    }
  }, [isEditMode, existingPackage]);

  const calculateBasePrice = () => {
    return products
      .filter((p) => selectedProducts.includes(p.id))
      .reduce((sum, p) => sum + p.price, 0);
  };

  const getTotalPrice = () => {
    if (customPrice && !isNaN(Number(customPrice))) {
      return Number(customPrice);
    }
    return calculateBasePrice();
  };

  const calculateCoins = (price: number) => {
    // 1% of price as coins (you can adjust this formula)
    return Math.floor(price * 0.01);
  };

  const getRedeemCoins = () => {
    if (customCoins && !isNaN(Number(customCoins))) {
      return Number(customCoins);
    }
    return calculateCoins(getTotalPrice());
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Package name is required",
        variant: "destructive",
      });
      return;
    }

    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one product",
        variant: "destructive",
      });
      return;
    }

    const productDetails = products
      .filter((p) => selectedProducts.includes(p.id))
      .map((p) => ({ id: p.id, name: p.name, price: p.price }));

    const packageData = {
      ...formData,
      products: selectedProducts,
      productDetails,
      price: getTotalPrice(),
      redeemCoins: getRedeemCoins(),
    };

    if (isEditMode && id) {
      updatePackage(id, packageData);
      toast({
        title: "Success",
        description: "Package updated successfully",
      });
    } else {
      addPackage(packageData);
      toast({
        title: "Success",
        description: "Package created successfully",
      });
    }
    
    navigate('/packages');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/packages')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            {isEditMode ? 'Edit Package' : 'Create New Package'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? 'Update the package details' : 'Fill in the details to create a subscription package'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Package Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter package name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your package..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Package Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="size">Package Size</Label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                    <SelectTrigger id="size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="frequency">Delivery Frequency *</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEditMode && (
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' | 'draft' })}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Package Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Package preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, photo: '' });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload package photo</span>
                    <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Products *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 max-h-80 overflow-y-auto space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <Checkbox
                      id={product.id}
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleProductToggle(product.id)}
                    />
                    <label
                      htmlFor={product.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <span className="text-sm font-semibold">৳{product.price}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {selectedProducts.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedProducts.length} product(s) selected
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Price:</span>
                  <span className="font-medium">৳{calculateBasePrice()}</span>
                </div>
                
                <div className="border-t pt-2">
                  <Label htmlFor="custom-price" className="text-xs">Custom Total Price (Optional)</Label>
                  <Input
                    id="custom-price"
                    type="number"
                    placeholder="Override price"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="bg-primary/10 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Price:</span>
                    <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                      ৳{getTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Auto Redeem Coins:</span>
                  <span className="font-medium">{calculateCoins(getTotalPrice())} coins</span>
                </div>

                <div>
                  <Label htmlFor="custom-coins" className="text-xs">Custom Coins (Optional)</Label>
                  <Input
                    id="custom-coins"
                    type="number"
                    placeholder="Override coins"
                    value={customCoins}
                    onChange={(e) => setCustomCoins(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="bg-accent p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Redeem Coins:</span>
                    <span className="text-xl font-bold text-primary">
                      {getRedeemCoins()} 🪙
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Type:</strong> {formData.type}</p>
                  <p><strong>Size:</strong> {formData.size}</p>
                  <p><strong>Frequency:</strong> {formData.frequency}</p>
                  <p><strong>Products:</strong> {selectedProducts.length}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button className="w-full" onClick={handleSubmit}>
                  {isEditMode ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Package
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Package
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/packages')}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
