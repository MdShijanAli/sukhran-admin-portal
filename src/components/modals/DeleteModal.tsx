import React, { ReactNode } from "react";
import { BaseModal } from "./BaseModal";

export interface DeleteModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  title?: string;
  description?: string | ReactNode;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteModal({
  open,
  onClose,
  title = "Are you sure?",
  description,
  onConfirm,
  isDeleting = false,
}: DeleteModalProps) {
  return (
    <BaseModal
      open={open}
      onOpenChange={onClose}
      title={title}
      onSubmit={onConfirm}
      isSubmitting={isDeleting}
      submitButtonText="Delete"
      submitButtonVariant="destructive"
      closeButtonText="Cancel"
      size="md"
    >
      <p className="text-sm text-muted-foreground">{description}</p>
    </BaseModal>
  );
}
