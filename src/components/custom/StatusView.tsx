import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType =
    | "payment"
    | "order"
    | "delivery"
    | "transaction"
    | "payment_method"
    | "default";

export interface StatusViewProps {
    status: string;
    type?: StatusType;
    label?: string;
    showIcon?: boolean;
    className?: string;
    size?: "sm" | "default" | "lg";
}

interface StatusConfig {
    label: string;
    className: string;
    icon?: string;
}

const getStatusConfig = (
    status: string,
    type: StatusType = "default"
): StatusConfig => {
    const normalizedStatus = status?.toLowerCase().replace(/_/g, "-");

    // Payment Status Configurations
    const paymentStatuses: Record<string, StatusConfig> = {
        pending: {
            label: "Pending",
            className:
                "bg-yellow-500/10 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/20",
            icon: "⏳",
        },
        paid: {
            label: "Paid",
            className:
                "bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20",
            icon: "✓",
        },
        failed: {
            label: "Failed",
            className:
                "bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20",
            icon: "✕",
        },
        cancelled: {
            label: "Cancelled",
            className:
                "bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20",
            icon: "✕",
        },
        refunded: {
            label: "Refunded",
            className:
                "bg-orange-500/10 text-orange-700 border-orange-500/30 hover:bg-orange-500/20",
            icon: "↩",
        },
    };

    // Order Status Configurations
    const orderStatuses: Record<string, StatusConfig> = {
        pending: {
            label: "Pending",
            className:
                "bg-yellow-500/10 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/20",
            icon: "⏳",
        },
        confirmed: {
            label: "Confirmed",
            className:
                "border-transparent bg-purple-600 text-white hover:bg-purple-700 shadow-sm",
            icon: "✓",
        },
        approved: {
            label: "Approved",
            className:
                "bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20",
            icon: "✓",
        },
        shipped: {
            label: "Shipped",
            className:
                "bg-blue-500/10 text-blue-700 border-blue-500/30 hover:bg-blue-500/20",
            icon: "📦",
        },
        delivered: {
            label: "Delivered",
            className:
                "bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20",
            icon: "✓",
        },
        cancelled: {
            label: "Cancelled",
            className:
                "bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20",
            icon: "✕",
        },
        "cancelled-at-delivery": {
            label: "Cancelled at Delivery",
            className:
                "bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20",
            icon: "✕",
        },
        returned: {
            label: "Returned",
            className:
                "bg-orange-500/10 text-orange-700 border-orange-500/30 hover:bg-orange-500/20",
            icon: "↩",
        },
        processing: {
            label: "Processing",
            className:
                "bg-indigo-500/10 text-indigo-700 border-indigo-500/30 hover:bg-indigo-500/20",
            icon: "⚙",
        },
    };

    // Delivery Status Configurations
    const deliveryStatuses: Record<string, StatusConfig> = {
        pending: {
            label: "Pending",
            className:
                "bg-yellow-500/10 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/20",
            icon: "⏳",
        },
        assigned: {
            label: "Assigned",
            className:
                "bg-blue-500/10 text-blue-700 border-blue-500/30 hover:bg-blue-500/20",
            icon: "👤",
        },
        "picked-up": {
            label: "Picked Up",
            className:
                "bg-indigo-500/10 text-indigo-700 border-indigo-500/30 hover:bg-indigo-500/20",
            icon: "📦",
        },
        "in-transit": {
            label: "In Transit",
            className:
                "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20",
            icon: "🚚",
        },
        delivered: {
            label: "Delivered",
            className:
                "bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20",
            icon: "✓",
        },
        failed: {
            label: "Failed",
            className:
                "bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20",
            icon: "✕",
        },
        cancelled: {
            label: "Cancelled",
            className:
                "bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20",
            icon: "✕",
        },
        confirmed: {
            label: "Confirmed",
            className:
                "bg-purple-500/10 text-purple-700 border-purple-500/30 hover:bg-purple-500/20",
            icon: "✓",
        },
        "out-for-delivery": {
            label: "Out for Delivery",
            className:
                "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20",
            icon: "🚚",
        },
    };

    // Transaction Status Configurations
    const transactionStatuses: Record<string, StatusConfig> = {
        success: {
            label: "Success",
            className:
                "bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20",
            icon: "✓",
        },
        failed: {
            label: "Failed",
            className:
                "bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20",
            icon: "✕",
        },
        pending: {
            label: "Pending",
            className:
                "bg-yellow-500/10 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/20",
            icon: "⏳",
        },
        refunded: {
            label: "Refunded",
            className:
                "bg-orange-500/10 text-orange-700 border-orange-500/30 hover:bg-orange-500/20",
            icon: "↩",
        },
    };

    // Payment Method Configurations
    const paymentMethods: Record<string, StatusConfig> = {
        cod: {
            label: "Cash on Delivery",
            className:
                "border-transparent bg-purple-600 text-white hover:bg-purple-700 shadow-sm",
            icon: "💵",
        },
        online: {
            label: "Online Payment",
            className:
                "border-transparent bg-green-600 text-white hover:bg-green-700 shadow-sm",
            icon: "💳",
        },
        "online-payment": {
            label: "Online Payment",
            className:
                "border-transparent bg-green-600 text-white hover:bg-green-700 shadow-sm",
            icon: "💳",
        },
        "online payment": {
            label: "Online Payment",
            className:
                "border-transparent bg-green-600 text-white hover:bg-green-700 shadow-sm",
            icon: "💳",
        },
    };

    // Select configuration based on type
    let config: StatusConfig | undefined;

    switch (type) {
        case "payment":
            config = paymentStatuses[normalizedStatus];
            break;
        case "order":
            config = orderStatuses[normalizedStatus];
            break;
        case "delivery":
            config = deliveryStatuses[normalizedStatus];
            break;
        case "transaction":
            config = transactionStatuses[normalizedStatus];
            break;
        case "payment_method":
            config = paymentMethods[normalizedStatus];
            break;
        default:
            // Try all configurations
            config =
                paymentStatuses[normalizedStatus] ||
                orderStatuses[normalizedStatus] ||
                deliveryStatuses[normalizedStatus] ||
                transactionStatuses[normalizedStatus] ||
                paymentMethods[normalizedStatus];
    }

    // Default fallback configuration
    if (!config) {
        config = {
            label: status
                .split(/[-_]/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
            className:
                "bg-gray-500/10 text-gray-700 border-gray-500/30 hover:bg-gray-500/20",
            icon: "•",
        };
    }

    return config;
};

export default function StatusView({
    status,
    type = "default",
    label,
    showIcon = false,
    className,
    size = "default",
}: StatusViewProps) {
    if (!status) return null;

    const config = getStatusConfig(status, type);
    const displayLabel = label || config.label;

    // Size variants
    const sizeClasses = {
        sm: "text-xs px-2 py-0.5 h-5",
        default: "text-xs px-2.5 py-0.5 h-6",
        lg: "text-sm px-3 py-1 h-7",
    };

    return (
        <Badge
            className={cn(
                config.className,
                sizeClasses[size],
                "font-medium transition-all duration-200",
                className
            )}
        >
            {showIcon && config.icon && (
                <span className="mr-1.5 text-[10px]">{config.icon}</span>
            )}
            {displayLabel}
        </Badge>
    );
}

// Utility function for backward compatibility with existing StatusVariant function
export const getStatusClassName = (
    status: string,
    type?: StatusType
): string => {
    const config = getStatusConfig(status, type);
    return config.className;
};
