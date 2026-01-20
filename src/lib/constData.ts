const constData = {
  roles: {
    ADMIN: "admin",
    CUSTOMER: "customer",
    SUPER_ADMIN: "super_admin",
  },

  priorities: {
    URGENT: "urgent",
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
  },

  ticketStatuses: {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    RESOLVED: "resolved",
    CLOSED: "closed",
  },

  ticketCategories: {
    DELIVERY: "delivery",
    PAYMENT: "payment",
    PRODUCT: "product",
    ACCOUNT: "account",
    ORDER: "order",
    RETURN: "return",
    OTHER: "other",
  },

  SSLCOMMERZ: "sslcommerz",

  paymentStatuses: {
    PENDING: "Pending",
    PAID: "Paid",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  },

  deliveryStatuses: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    OUT_FOR_DELIVERY: "out_for_delivery",
    DELIVERED: "delivered",
    FAILED: "failed",
    CANCELLED: "cancelled",
  },

  paymentModes: {
    COD: "Cod",
    ONLINE: "Online",
    ONLINE_PAYMENT: "Online Payment",
  },

  orderStatuses: {
    PENDING: "Pending",
    APPROVED: "Approved",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    CANCELLED_AT_DELIVERY: "Cancelled_at_delivery",
    RETURNED: "Returned",
    CONFIRMED: "Confirmed",
  },

  transactionStatuses: {
    SUCCESS: "Success",
    FAILED: "Failed",
    PENDING: "Pending",
    REFUNDED: "Refunded",
  },
};

export default constData;
