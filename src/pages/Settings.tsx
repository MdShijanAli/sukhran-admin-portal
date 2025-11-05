import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Bell,
  Settings2,
  CreditCard,
  Mail,
  Globe,
  Truck,
  ShoppingCart,
  Clock,
  DollarSign,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const { t } = useTranslation();

  // Business Settings
  const [businessName, setBusinessName] = useState("My E-Commerce Store");
  const [businessEmail, setBusinessEmail] = useState("business@example.com");
  const [businessPhone, setBusinessPhone] = useState("+880 1712-345678");
  const [businessAddress, setBusinessAddress] = useState(
    "123 Main Street, Dhaka"
  );
  const [taxId, setTaxId] = useState("TAX123456");
  const [currency, setCurrency] = useState("BDT");
  const [timezone, setTimezone] = useState("Asia/Dhaka");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [customerSignups, setCustomerSignups] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  // System Preferences
  const [autoApproveOrders, setAutoApproveOrders] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);
  const [enableReviews, setEnableReviews] = useState(true);
  const [enableWishlist, setEnableWishlist] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [orderPrefix, setOrderPrefix] = useState("ORD-");

  // Payment Settings
  const [paymentGateway, setPaymentGateway] = useState("stripe");
  const [enableCOD, setEnableCOD] = useState(true);
  const [enableBankTransfer, setEnableBankTransfer] = useState(true);
  const [minOrderAmount, setMinOrderAmount] = useState("100");

  // Shipping Settings
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("1000");
  const [standardShippingCost, setStandardShippingCost] = useState("60");
  const [expressShippingCost, setExpressShippingCost] = useState("150");
  const [defaultShippingMethod, setDefaultShippingMethod] =
    useState("standard");

  // Email Settings
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [fromEmail, setFromEmail] = useState("noreply@example.com");
  const [fromName, setFromName] = useState("My Store");

  const handleSaveBusinessSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Business settings have been updated successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSaveSystemPreferences = () => {
    toast({
      title: "System Updated",
      description: "System preferences have been saved successfully.",
    });
  };

  const handleSavePaymentSettings = () => {
    toast({
      title: "Payment Settings Saved",
      description: "Payment configuration has been updated.",
    });
  };

  const handleSaveShippingSettings = () => {
    toast({
      title: "Shipping Settings Saved",
      description: "Shipping configuration has been updated.",
    });
  };

  const handleSaveEmailSettings = () => {
    toast({
      title: "Email Settings Saved",
      description: "SMTP configuration has been updated.",
    });
  };

  const handleTestEmail = () => {
    toast({
      title: "Test Email Sent",
      description: "Check your inbox for the test email.",
    });
  };

  return (
    <div className=" max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your store settings and preferences
        </p>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Shipping</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your store's business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / Business Number</Label>
                  <Input
                    id="taxId"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BDT">
                        BDT - Bangladeshi Taka
                      </SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dhaka">
                        Asia/Dhaka (GMT+6)
                      </SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">
                        America/New York (EST)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europe/London (GMT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveBusinessSettings}>
                  Save Changes
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important events
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new orders are placed
                  </p>
                </div>
                <Switch
                  checked={orderNotifications}
                  onCheckedChange={setOrderNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when product stock is running low
                  </p>
                </div>
                <Switch
                  checked={lowStockAlerts}
                  onCheckedChange={setLowStockAlerts}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Customer Signups</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when new customers register
                  </p>
                </div>
                <Switch
                  checked={customerSignups}
                  onCheckedChange={setCustomerSignups}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly performance reports via email
                  </p>
                </div>
                <Switch
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about payment confirmations and failures
                  </p>
                </div>
                <Switch
                  checked={paymentAlerts}
                  onCheckedChange={setPaymentAlerts}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveNotifications}>
                  Save Preferences
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Preferences */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure system behavior and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-approve Orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve orders when placed
                    </p>
                  </div>
                  <Switch
                    checked={autoApproveOrders}
                    onCheckedChange={setAutoApproveOrders}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the store in maintenance mode
                    </p>
                  </div>
                  <Switch
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Out of Stock Products</Label>
                    <p className="text-sm text-muted-foreground">
                      Display products that are out of stock
                    </p>
                  </div>
                  <Switch
                    checked={showOutOfStock}
                    onCheckedChange={setShowOutOfStock}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Guest Checkout</Label>
                    <p className="text-sm text-muted-foreground">
                      Let customers checkout without registration
                    </p>
                  </div>
                  <Switch
                    checked={allowGuestCheckout}
                    onCheckedChange={setAllowGuestCheckout}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Product Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to leave product reviews
                    </p>
                  </div>
                  <Switch
                    checked={enableReviews}
                    onCheckedChange={setEnableReviews}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Wishlist</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to create wishlists
                    </p>
                  </div>
                  <Switch
                    checked={enableWishlist}
                    onCheckedChange={setEnableWishlist}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderPrefix">Order Number Prefix</Label>
                  <Input
                    id="orderPrefix"
                    value={orderPrefix}
                    onChange={(e) => setOrderPrefix(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveSystemPreferences}>
                  Save Configuration
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Configure payment methods and gateways
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentGateway">
                    Primary Payment Gateway
                  </Label>
                  <Select
                    value={paymentGateway}
                    onValueChange={setPaymentGateway}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Cash on Delivery</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to pay with cash on delivery
                    </p>
                  </div>
                  <Switch checked={enableCOD} onCheckedChange={setEnableCOD} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Bank Transfer</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow direct bank transfer payments
                    </p>
                  </div>
                  <Switch
                    checked={enableBankTransfer}
                    onCheckedChange={setEnableBankTransfer}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount">
                    Minimum Order Amount (৳)
                  </Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSavePaymentSettings}>
                  Save Payment Settings
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Configuration</CardTitle>
              <CardDescription>
                Configure shipping methods and costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultShippingMethod">
                  Default Shipping Method
                </Label>
                <Select
                  value={defaultShippingMethod}
                  onValueChange={setDefaultShippingMethod}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Shipping</SelectItem>
                    <SelectItem value="express">Express Shipping</SelectItem>
                    <SelectItem value="pickup">Store Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="standardShippingCost">
                    Standard Shipping Cost (৳)
                  </Label>
                  <Input
                    id="standardShippingCost"
                    type="number"
                    value={standardShippingCost}
                    onChange={(e) => setStandardShippingCost(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expressShippingCost">
                    Express Shipping Cost (৳)
                  </Label>
                  <Input
                    id="expressShippingCost"
                    type="number"
                    value={expressShippingCost}
                    onChange={(e) => setExpressShippingCost(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">
                  Free Shipping Threshold (৳)
                </Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Orders above this amount will receive free shipping
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveShippingSettings}>
                  Save Shipping Settings
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure SMTP settings for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={smtpUsername}
                    onChange={(e) => setSmtpUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEmailSettings}>
                  Save Email Settings
                </Button>
                <Button variant="outline" onClick={handleTestEmail}>
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
