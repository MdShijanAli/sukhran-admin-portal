import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface BaseModalProps {
  // Modal State
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Header
  title: string;

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
  loading?: boolean;

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
  loading,
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
      <DialogContent
        className={`${sizeClasses[size]} ${
          className || ""
        } flex flex-col max-h-[90vh]`}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="px-4 py-2 overflow-y-auto flex-1 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            children
          )}
        </div>

        <DialogFooter className="flex-shrink-0">
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
