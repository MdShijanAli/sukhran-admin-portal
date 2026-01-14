import { useState } from "react";
import { BaseModal } from "@/components/modals";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantityUpdateModalProps {
  open: boolean;
  onClose: () => void;
  oldQuantity: number;
  newQuantity: number;
  onQuantityChange: (quantity: number) => void;
  onConfirm: (reason: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function QuantityUpdateModal({
  open,
  onClose,
  oldQuantity,
  newQuantity,
  onQuantityChange,
  onConfirm,
  isSubmitting,
}: QuantityUpdateModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    await onConfirm(reason);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={handleClose}
      title="Update Item Quantity"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Update Quantity"
    >
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Quantity:</span>
            <span className="text-lg font-semibold">{oldQuantity}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">New Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (newQuantity > 1) {
                    onQuantityChange(newQuantity - 1);
                  }
                }}
                disabled={newQuantity === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-bold min-w-[3rem] text-center">
                {newQuantity}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onQuantityChange(newQuantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="update-reason">
            Reason for quantity change <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="update-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Customer increased quantity via phone"
            rows={3}
            required
          />
        </div>
      </div>
    </BaseModal>
  );
}
