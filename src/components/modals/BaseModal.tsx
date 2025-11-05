import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface BaseModalProps {
  // Modal State
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Header
  title: string;
  description?: string;

  // Content
  children: ReactNode;

  // Footer Actions
  showCloseButton?: boolean;
  closeButtonText?: string;
  closeButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onClose?: () => void;

  showSubmitButton?: boolean;
  submitButtonText?: string;
  submitButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onSubmit?: () => void;
  submitButtonDisabled?: boolean;
  isSubmitting?: boolean;

  // Additional custom actions
  customActions?: ReactNode;

  // Styling
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

export function BaseModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  showCloseButton = true,
  closeButtonText = "Cancel",
  closeButtonVariant = "outline",
  onClose,
  showSubmitButton = true,
  submitButtonText = "Submit",
  submitButtonVariant = "default",
  onSubmit,
  submitButtonDisabled = false,
  isSubmitting = false,
  customActions,
  size = "md",
  className,
}: BaseModalProps) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      onOpenChange(false);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClasses[size]} ${className || ""}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        <DialogFooter>
          {customActions}
          {showCloseButton && (
            <Button
              variant={closeButtonVariant}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {closeButtonText}
            </Button>
          )}
          {showSubmitButton && (
            <Button
              variant={submitButtonVariant}
              onClick={handleSubmit}
              disabled={submitButtonDisabled || isSubmitting}
            >
              {isSubmitting ? "Processing..." : submitButtonText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
