import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import supportService from "@/services/supportService";

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTicketModal({
  open,
  onClose,
  onSuccess,
}: CreateTicketModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (open) {
      setOrderId("");
      setCategory("");
      setSubject("");
      setDescription("");
      setPriority("");
      setAttachment(null);
      setFileName("");
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      setFileName(file.name);
    }
  };

  const removeFile = () => {
    setAttachment(null);
    setFileName("");
  };

  const handleSubmit = async () => {
    if (!category) {
      toast.error(t("support.validation.categoryRequired"));
      return;
    }

    if (!subject.trim()) {
      toast.error(t("support.validation.subjectRequired"));
      return;
    }

    if (!description.trim()) {
      toast.error(t("support.validation.descriptionRequired"));
      return;
    }

    if (!priority) {
      toast.error(t("support.validation.priorityRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (orderId) formData.append("order_id", orderId);
      formData.append("category", category);
      formData.append("subject", subject.trim());
      formData.append("description", description.trim());
      formData.append("priority", priority);
      if (attachment) formData.append("attachment", attachment);

      await supportService.storeItem(formData);
      toast.success(t("support.messages.created"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error(
        error.response.data.message || t("support.messages.failedToCreate")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={t("support.create.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText={t("support.create.submit")}
      size="2xl"
    >
      <div className="space-y-4">
        {/* Order ID (Optional) */}
        <div>
          <Label htmlFor="orderId">
            {t("support.create.orderId")}{" "}
            <span className="text-xs text-muted-foreground">
              ({t("support.create.optional")})
            </span>
          </Label>
          <Input
            id="orderId"
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t("support.create.orderIdPlaceholder")}
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">{t("support.create.category")} *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue
                placeholder={t("support.create.categoryPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delivery">
                {t("support.tickets.category.delivery")}
              </SelectItem>
              <SelectItem value="payment">
                {t("support.tickets.category.payment")}
              </SelectItem>
              <SelectItem value="product">
                {t("support.tickets.category.product")}
              </SelectItem>
              <SelectItem value="account">
                {t("support.tickets.category.account")}
              </SelectItem>
              <SelectItem value="order">
                {t("support.tickets.category.order")}
              </SelectItem>
              <SelectItem value="return">
                {t("support.tickets.category.return")}
              </SelectItem>
              <SelectItem value="other">
                {t("support.tickets.category.other")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subject */}
        <div>
          <Label htmlFor="subject">{t("support.create.subject")} *</Label>
          <Input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("support.create.subjectPlaceholder")}
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">
            {t("support.create.description")} *
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("support.create.descriptionPlaceholder")}
            rows={5}
          />
        </div>

        {/* Priority */}
        <div>
          <Label htmlFor="priority">{t("support.create.priority")} *</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="priority">
              <SelectValue
                placeholder={t("support.create.priorityPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">
                {t("support.tickets.priority.urgent")}
              </SelectItem>
              <SelectItem value="high">
                {t("support.tickets.priority.high")}
              </SelectItem>
              <SelectItem value="medium">
                {t("support.tickets.priority.medium")}
              </SelectItem>
              <SelectItem value="low">
                {t("support.tickets.priority.low")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Attachment (Optional) */}
        <div>
          <Label>
            {t("support.create.attachment")}{" "}
            <span className="text-xs text-muted-foreground">
              ({t("support.create.optional")})
            </span>
          </Label>
          <div className="mt-2">
            {fileName ? (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">{fileName}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      {t("support.create.selectFile")}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("support.create.fileFormats")}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
