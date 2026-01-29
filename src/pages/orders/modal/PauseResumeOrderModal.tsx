import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@/components/modals/BaseModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import orderService from "@/services/orderService";

interface PauseResumeOrderModalProps {
    open: boolean;
    onClose: () => void;
    orderId: number;
    orderNumber?: string;
    onSuccess: () => void;
    type: "pause" | "resume";
}

export default function PauseResumeOrderModal({
    open,
    onClose,
    orderId,
    orderNumber,
    onSuccess,
    type,
}: PauseResumeOrderModalProps) {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleClose = () => {
        setReason("");
        setError("");
        onClose();
    };

    const handleSubmit = async () => {
        if (!reason.trim()) {
            setError(
                t(`orders.packageOrders.modals.${type}Order.validation.reasonRequired`)
            );
            return;
        }
        if (reason.trim().length < 10) {
            setError(
                t(`orders.packageOrders.modals.${type}Order.validation.reasonMinLength`)
            );
            return;
        }

        setIsSubmitting(true);
        try {
            const apiCall = type === "pause"
                ? orderService.pausePackageOrder(orderId, { reason: reason.trim() })
                : orderService.resumePackageOrder(orderId, { reason: reason.trim() });

            await apiCall;

            toast.success(
                t(`orders.packageOrders.messages.order${type === "pause" ? "Paused" : "Resumed"}`)
            );
            onSuccess();
            handleClose();
        } catch (error) {
            console.error(`Error ${type}ing order:`, error);
            toast.error(
                t(`orders.packageOrders.messages.failedTo${type === "pause" ? "Pause" : "Resume"}`)
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal
            open={open}
            onOpenChange={handleClose}
            title={t(`orders.packageOrders.modals.${type}Order.title`)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText={t("submit")}
        >
            <div className="space-y-4">
                <div>
                    <Label htmlFor="reason">
                        {t(`orders.packageOrders.modals.${type}Order.reason`)} *
                    </Label>
                    <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setError("");
                        }}
                        placeholder={t(
                            `orders.packageOrders.modals.${type}Order.reasonPlaceholder`
                        )}
                        rows={4}
                    />
                    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                </div>
            </div>
        </BaseModal>
    );
}
