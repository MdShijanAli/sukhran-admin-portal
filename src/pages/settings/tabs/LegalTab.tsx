import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { Shield, FileText, Eye, Save, RotateCcw } from "lucide-react";
import { useContentStore, ContentType } from "@/stores/contentStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LegalTab() {
  const { t } = useTranslation();
  const { contents, updateContent, addContent } = useContentStore();

  // Get existing terms and privacy content
  const termsContent = contents.find((c) => c.type === "terms");
  const privacyContent = contents.find((c) => c.type === "privacy");

  const [termsText, setTermsText] = useState(termsContent?.content || "");
  const [privacyText, setPrivacyText] = useState(privacyContent?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState({
    title: "",
    content: "",
  });
  const [activeTab, setActiveTab] = useState("terms");

  const handleSave = async (type: "terms" | "privacy") => {
    setIsSaving(true);
    try {
      const content = type === "terms" ? termsText : privacyText;
      const title = type === "terms" ? "Terms of Service" : "Privacy Policy";
      const existingContent = type === "terms" ? termsContent : privacyContent;

      if (existingContent) {
        updateContent(existingContent.id, {
          content,
          title,
          status: "published",
          author: "Admin User",
        });
      } else {
        addContent({
          type: type as ContentType,
          title,
          content,
          status: "published",
          author: "Admin User",
        });
      }

      toast.success(`${title} saved successfully`);
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = (type: "terms" | "privacy") => {
    if (type === "terms") {
      setTermsText(termsContent?.content || "");
    } else {
      setPrivacyText(privacyContent?.content || "");
    }
    toast.info("Content reset to last saved version");
  };

  const handlePreview = (type: "terms" | "privacy") => {
    const title = type === "terms" ? "Terms of Service" : "Privacy Policy";
    const content = type === "terms" ? termsText : privacyText;
    setPreviewContent({ title, content });
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t("settings.legal.title")}
          </CardTitle>
          <CardDescription>{t("settings.legal.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("settings.legal.termsOfService")}
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t("settings.legal.privacyPolicy")}
              </TabsTrigger>
            </TabsList>

            {/* Terms of Service Tab */}
            <TabsContent value="terms" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t("settings.legal.termsContent")}</Label>
                <RichTextEditor
                  value={termsText}
                  onChange={setTermsText}
                  placeholder={t("settings.legal.termsPlaceholder")}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReset("terms")}
                    disabled={isSaving}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t("settings.legal.reset")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePreview("terms")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t("settings.legal.preview")}
                  </Button>
                </div>
                <Button onClick={() => handleSave("terms")} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving
                    ? t("settings.legal.saving")
                    : t("settings.legal.saveTerms")}
                </Button>
              </div>

              {termsContent && (
                <div className="text-sm text-muted-foreground pt-2 border-t">
                  <p>
                    {t("settings.legal.lastUpdated")} {termsContent.updatedAt}
                  </p>
                  <p>
                    {t("settings.legal.lastUpdatedBy")} {termsContent.author}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Privacy Policy Tab */}
            <TabsContent value="privacy" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t("settings.legal.privacyContent")}</Label>
                <RichTextEditor
                  value={privacyText}
                  onChange={setPrivacyText}
                  placeholder={t("settings.legal.privacyPlaceholder")}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReset("privacy")}
                    disabled={isSaving}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t("settings.legal.reset")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePreview("privacy")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t("settings.legal.preview")}
                  </Button>
                </div>
                <Button
                  onClick={() => handleSave("privacy")}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving
                    ? t("settings.legal.saving")
                    : t("settings.legal.savePrivacy")}
                </Button>
              </div>

              {privacyContent && (
                <div className="text-sm text-muted-foreground pt-2 border-t">
                  <p>
                    {t("settings.legal.lastUpdated")} {privacyContent.updatedAt}
                  </p>
                  <p>
                    {t("settings.legal.lastUpdatedBy")} {privacyContent.author}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewContent.title}</DialogTitle>
            <DialogDescription>
              {t("settings.legal.previewDescription")}
            </DialogDescription>
          </DialogHeader>
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: previewContent.content }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
