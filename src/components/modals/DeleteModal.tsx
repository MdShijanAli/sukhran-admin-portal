import React, { ReactNode } from "react";
import { BaseModal } from "./BaseModal";
import { useTranslation } from "react-i18next";

export interface DeleteModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  title?: string;
  description?: string | ReactNode;
  onConfirm: () => void;
  isDeleting?: boolean;
  children?: ReactNode;
}

export default function DeleteModal({
  open,
  onClose,
  title = "Are you sure?",
  description,
  onConfirm,
  isDeleting = false,
  children,
}: DeleteModalProps) {
  const { t } = useTranslation();
  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={title}
      onSubmit={onConfirm}
      isSubmitting={isDeleting}
      submitButtonText={t("delete")}
      submitButtonVariant="destructive"
      closeButtonText={t("cancel")}
      size="md"
    >
      <div className="space-y-4">
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    </BaseModal>
  );
}
