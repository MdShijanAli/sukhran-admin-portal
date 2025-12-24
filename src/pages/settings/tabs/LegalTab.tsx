import { useState, useEffect } from "react";
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
import { Shield, FileText, Eye, Save, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BaseModal } from "@/components/modals";
import settingsService, { LegalDocument } from "@/services/settingsService";
import { Badge } from "@/components/ui/badge";

export default function LegalTab() {
  const { t } = useTranslation();

  const [termsDocument, setTermsDocument] = useState<LegalDocument | null>(
    null
  );
  const [privacyDocument, setPrivacyDocument] = useState<LegalDocument | null>(
    null
  );

  const [termsText, setTermsText] = useState("");
  const [privacyText, setPrivacyText] = useState("");
  const [termsVersion, setTermsVersion] = useState("");
  const [privacyVersion, setPrivacyVersion] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState({
    title: "",
    content: "",
  });
  const [activeTab, setActiveTab] = useState("terms");

  // Fetch legal documents on mount
  useEffect(() => {
    fetchLegalDocuments();
  }, []);

  const fetchLegalDocuments = async () => {
    setIsLoading(true);
    try {
      // Fetch both documents in parallel
      const [termsResponse, privacyResponse] = await Promise.all([
        settingsService.getLegalDocumentByType("terms_and_conditions"),
        settingsService.getLegalDocumentByType("privacy_policy"),
      ]);

      // Set terms document
      if (termsResponse.data && termsResponse.data.length > 0) {
        const terms = termsResponse.data[0];
        setTermsDocument(terms);
        setTermsText(terms.content);
        setTermsVersion(terms.version || "1.0");
      }

      // Set privacy document
      if (privacyResponse.data && privacyResponse.data.length > 0) {
        const privacy = privacyResponse.data[0];
        setPrivacyDocument(privacy);
        setPrivacyText(privacy.content);
        setPrivacyVersion(privacy.version || "1.0");
      }
    } catch (error) {
      console.error("Error fetching legal documents:", error);
      toast.error("Failed to load legal documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (type: "terms" | "privacy") => {
    setIsSaving(true);
    try {
      const content = type === "terms" ? termsText : privacyText;
      const version = type === "terms" ? termsVersion : privacyVersion;
      const title =
        type === "terms" ? "Terms and Conditions" : "Privacy Policy";
      const existingDocument =
        type === "terms" ? termsDocument : privacyDocument;
      const docType =
        type === "terms" ? "terms_and_conditions" : "privacy_policy";

      if (existingDocument) {
        // Update existing document
        await settingsService.updateLegalDocument(existingDocument.id, {
          title,
          content,
          version,
        });
        toast.success(`${title} updated successfully`);
      } else {
        // Create new document
        await settingsService.createLegalDocument({
          type: docType,
          title,
          content,
          version,
          is_active: true,
        });
        toast.success(`${title} created successfully`);
      }

      // Refetch to get updated data
      await fetchLegalDocuments();
    } catch (error: any) {
      console.error("Error saving content:", error);
      toast.error(error?.response?.data?.message || "Failed to save content");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = (type: "terms" | "privacy") => {
    if (type === "terms") {
      setTermsText(termsDocument?.content || "");
      setTermsVersion(termsDocument?.version || "1.0");
    } else {
      setPrivacyText(privacyDocument?.content || "");
      setPrivacyVersion(privacyDocument?.version || "1.0");
    }
    toast.info("Content reset to last saved version");
  };

  const handlePreview = (type: "terms" | "privacy") => {
    const title = type === "terms" ? "Terms and Conditions" : "Privacy Policy";
    const content = type === "terms" ? termsText : privacyText;
    setPreviewContent({ title, content });
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading legal documents...</p>
        </CardContent>
      </Card>
    );
  }

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
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("settings.legal.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t("settings.legal.saveTerms")}
                    </>
                  )}
                </Button>
              </div>

              {termsDocument && (
                <div className="text-sm text-muted-foreground pt-2 border-t space-y-1">
                  <p>
                    <span className="font-medium">Version:</span>{" "}
                    {termsDocument.version}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("settings.legal.lastUpdated")}:
                    </span>{" "}
                    {new Date(termsDocument.updated_at).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("settings.legal.lastUpdatedBy")}:
                    </span>{" "}
                    {termsDocument.updated_by?.name ||
                      termsDocument.created_by.name}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={
                        termsDocument.is_active
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {termsDocument.is_active ? "Active" : "Inactive"}
                    </span>
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
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("settings.legal.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t("settings.legal.savePrivacy")}
                    </>
                  )}
                </Button>
              </div>

              {privacyDocument && (
                <div className="text-sm text-muted-foreground pt-2 border-t space-y-1">
                  <p>
                    <span className="font-medium">Version:</span>{" "}
                    {privacyDocument.version}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("settings.legal.lastUpdated")}:
                    </span>{" "}
                    {new Date(privacyDocument.updated_at).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("settings.legal.lastUpdatedBy")}:
                    </span>{" "}
                    {privacyDocument.updated_by?.name ||
                      privacyDocument.created_by.name}
                  </p>
                  {privacyDocument.effective_date && (
                    <p>
                      <span className="font-medium">Effective Date:</span>{" "}
                      {new Date(
                        privacyDocument.effective_date
                      ).toLocaleDateString()}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={
                        privacyDocument.is_active
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {privacyDocument.is_active ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <BaseModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        title={previewContent.title}
        showSubmitButton={false}
        closeButtonText={t("close")}
        size="4xl"
      >
        {/* Document Content */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-3">
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: previewContent.content }}
            />
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
