import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Upload,
  Palette,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  // Personal Info State
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("+880 1712-345678");
  const [location, setLocation] = useState("Dhaka, Bangladesh");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Theme Colors State
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  const [secondaryColor, setSecondaryColor] = useState("#EC4899");

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handlePersonalInfoSave = () => {
    toast({
      title: t("profile.success"),
      description: t("profile.personalInfoUpdated"),
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: t("profile.error"),
        description: t("profile.passwordMismatch"),
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: t("profile.error"),
        description: t("profile.passwordTooShort"),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("profile.success"),
      description: t("profile.passwordChanged"),
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: t("profile.success"),
        description: t("profile.logoUploaded"),
      });
    }
  };

  const handleThemeColorsSave = () => {
    // Update CSS variables
    document.documentElement.style.setProperty("--primary", primaryColor);
    document.documentElement.style.setProperty("--secondary", secondaryColor);

    toast({
      title: t("profile.success"),
      description: t("profile.themeColorsUpdated"),
    });
  };

  return (
    <div className=" max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          {t("profile.title")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("profile.subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Avatar Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t("profile.avatar")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarFallback className="text-4xl bg-gradient-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {user.role}
              </p>
            </div>
            <div className="w-full">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {t("profile.uploadAvatar")}
                  </p>
                </div>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  {t("profile.personalInfo")}
                </TabsTrigger>
                <TabsTrigger value="password">
                  <Lock className="h-4 w-4 mr-2" />
                  {t("profile.security")}
                </TabsTrigger>
                <TabsTrigger value="theme">
                  <Palette className="h-4 w-4 mr-2" />
                  {t("profile.theme")}
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t("profile.name")}
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t("profile.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {t("profile.phone")}
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="location"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      {t("profile.location")}
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="role" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t("profile.role")}
                    </Label>
                    <Input
                      id="role"
                      value={user.role}
                      disabled
                      className="capitalize"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handlePersonalInfoSave}>
                    {t("common.save")}
                  </Button>
                  <Button variant="outline">{t("common.cancel")}</Button>
                </div>
              </TabsContent>

              {/* Password Change Tab */}
              <TabsContent value="password" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {t("profile.passwordRequirements")}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">
                      {t("profile.currentPassword")}
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">
                      {t("profile.newPassword")}
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">
                      {t("profile.confirmPassword")}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handlePasswordChange}>
                    {t("profile.changePassword")}
                  </Button>
                  <Button variant="outline">{t("common.cancel")}</Button>
                </div>
              </TabsContent>

              {/* Theme Customization Tab */}
              <TabsContent value="theme" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {t("profile.themeDescription")}
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="logo-upload">
                        {t("profile.companyLogo")}
                      </Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                          <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {t("profile.uploadLogo")}
                          </p>
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                          />
                        </Label>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="primaryColor">
                        {t("profile.primaryColor")}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-10 w-20"
                        />
                        <Input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="secondaryColor">
                        {t("profile.secondaryColor")}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="h-10 w-20"
                        />
                        <Input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {t("profile.colorPreview")}
                      </h4>
                      <div className="flex gap-2">
                        <div
                          className="h-12 w-full rounded-lg"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <div
                          className="h-12 w-full rounded-lg"
                          style={{ backgroundColor: secondaryColor }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleThemeColorsSave}>
                    {t("profile.applyTheme")}
                  </Button>
                  <Button variant="outline">{t("common.cancel")}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
