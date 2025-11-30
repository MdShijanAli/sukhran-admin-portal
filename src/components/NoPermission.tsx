import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NoPermissionProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export default function NoPermission({
  title,
  message,
  showBackButton = true,
  showHomeButton = true,
}: NoPermissionProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-dashed">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <ShieldX className="h-12 w-12 text-destructive" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-2 text-foreground">
              {title || t("noPermission.title", "Access Denied")}
            </h2>

            {/* Message */}
            <p className="text-muted-foreground mb-6 text-sm">
              {message ||
                t(
                  "noPermission.message",
                  "You don't have permission to access this page. Please contact your administrator if you believe this is an error."
                )}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {showBackButton && (
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("noPermission.goBack", "Go Back")}
                </Button>
              )}
              {showHomeButton && (
                <Button
                  variant="default"
                  onClick={() => navigate("/dashboard")}
                  className="w-full sm:w-auto"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {t("noPermission.goHome", "Go to Dashboard")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
