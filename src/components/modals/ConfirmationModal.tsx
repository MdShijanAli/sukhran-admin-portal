import React, { ReactNode } from "react";
import { BaseModal } from "./BaseModal";

export interface DeleteModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  title?: string;
  description?: string | ReactNode;
  onConfirm: () => void;
  isProcessing?: boolean;
}

export default function ConfirmationModal({
  open,
  onClose,
  title = "Are you sure?",
  description,
  onConfirm,
  isProcessing = false,
}: DeleteModalProps) {
  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={title}
      onSubmit={onConfirm}
      isSubmitting={isProcessing}
      submitButtonText="Confirm"
      submitButtonVariant="default"
      closeButtonText="Cancel"
      size="md"
    >
      <p className="text-sm text-muted-foreground">{description}</p>
    </BaseModal>
  );
}
