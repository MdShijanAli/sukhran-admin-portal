import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent } from "@/components/ui/card";
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
  EyeIcon,
  EyeOff,
} from "lucide-react";
import authService from "@/services/authService";
import { toast } from "sonner";

export default function Profile() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  // Personal Info State
  const [name, setName] = useState(user.firstName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user.mobile || "");
  const [location, setLocation] = useState("Dhaka, Bangladesh");
  const [showPassword, setShowPassword] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
  });

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Theme Colors State
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  const [secondaryColor, setSecondaryColor] = useState("#EC4899");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    user?.image_url || ""
  );

  if (!user) return null;

  const initials = user.firstName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handlePersonalInfoSave = () => {};

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      return;
    }

    if (newPassword.length < 6) {
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploadingLogo(true);
    const data = new FormData();
    data.append("displayImage", file);

    try {
      const result = await authService.updateLogo(data);
      if (result && result.success) {
        toast.success(result.message || "Logo uploaded successfully");
        // Fetch updated profile to get new image URL
        await authService.fetchProfile();
      } else {
        throw new Error("Logo upload failed");
      }
      console.log("Logo upload result:", result);
    } catch (error) {
      console.error("Logo upload error:", error);
      toast.error("Failed to upload logo");
      // Revert preview on error
      setImagePreview(user?.image_url || "");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleThemeColorsSave = () => {
    // Update CSS variables
    document.documentElement.style.setProperty("--primary", primaryColor);
    document.documentElement.style.setProperty("--secondary", secondaryColor);
  };

  return (
    <div className="max-w-6xl">
      <div className="grid gap-3 md:grid-cols-3">
        {/* Profile Avatar Card */}
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative my-3">
              <Avatar
                className={`h-32 w-32 ${
                  uploadingLogo
                    ? "animate-spin border-4 border-primary border-t-transparent rounded-full"
                    : ""
                }`}
              >
                <AvatarFallback className="text-4xl bg-gradient-primary">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={user.firstName}
                      className="w-full h-full object-cover object-top border-2 border-primary rounded-full"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </AvatarFallback>
              </Avatar>
              {uploadingLogo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="text-white text-sm">Uploading...</div>
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{user.firstName}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {user.role.name}
              </p>
            </div>
            <div className="w-full">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {uploadingLogo ? "Uploading..." : t("profile.uploadAvatar")}
                  </p>
                </div>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
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
                      value={user.role.name}
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
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword.old_password ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      {showPassword.old_password ? (
                        <EyeIcon
                          className="absolute right-3 top-3 h-5 w-5 text-muted-foreground cursor-pointer"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              old_password: false,
                            })
                          }
                        />
                      ) : (
                        <EyeOff
                          className="absolute right-3 top-3 h-5 w-5 text-muted-foreground cursor-pointer"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              old_password: true,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">
                      {t("profile.newPassword")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword.new_password ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      {showPassword.new_password ? (
                        <EyeIcon
                          className="absolute right-3 top-3 h-5 w-5 text-muted-foreground cursor-pointer"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              new_password: false,
                            })
                          }
                        />
                      ) : (
                        <EyeOff
                          className="absolute right-3 top-3 h-5 w-5 text-muted-foreground cursor-pointer"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              new_password: true,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">
                      {t("profile.confirmPassword")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={
                          showPassword.confirm_password ? "text" : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      {showPassword.confirm_password ? (
                        <EyeIcon
                          className="absolute right-3 top-3 h-5 w-5 text-muted-foreground cursor-pointer"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              confirm_password: false,
                            })
                          }
                        />
                      ) : (
                        <EyeOff
                          className="absolute right-3 top-3 h-5 w-5 text-muted-foreground cursor-pointer"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              confirm_password: true,
                            })
                          }
                        />
                      )}
                    </div>
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
