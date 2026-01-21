import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import constData from "./constData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDDMMYYY = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month.slice(0, 3)}, ${year}`;
};

export const formatNumberWithCommas = (
  number: number | string = 0,
  options: { minDigit?: number; maxDigit?: number } = {},
): string => {
  let value = number;

  const { minDigit = 2, maxDigit = 2 } = options;

  if (typeof number !== "number") {
    value = Number(number);
  }

  const formatted = (value as number).toLocaleString("en-US", {
    minimumFractionDigits: minDigit,
    maximumFractionDigits: maxDigit,
  });

  return formatted;
};

export const unFormatNumberWithCommas = (value: string | number): number => {
  // Remove commas and convert the string to a number
  return value ? parseFloat(String(value).replace(/,/g, "")) : 0;
};

export const formatCurrency = (
  amount: number | string,
  currency: string = "৳",
): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${currency}${formatNumberWithCommas(numAmount)}`;
};

export const StatusVariant = (status: string) => {
  switch (status) {
    case constData.paymentStatuses.PENDING:
    case constData.transactionStatuses.PENDING:
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case constData.paymentStatuses.PAID:
    case constData.orderStatuses.APPROVED:
    case constData.orderStatuses.SHIPPED:
    case constData.orderStatuses.DELIVERED:
    case constData.transactionStatuses.SUCCESS:
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case constData.paymentStatuses.FAILED:
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case constData.paymentStatuses.REFUNDED:
    case constData.transactionStatuses.REFUNDED:
    case constData.orderStatuses.RETURNED:
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case constData.paymentStatuses.CANCELLED:
    case constData.orderStatuses.CANCELLED:
    case constData.orderStatuses.CANCELLED_AT_DELIVERY:
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case constData.paymentModes.COD:
    case constData.paymentModes.cod:
    case constData.orderStatuses.CONFIRMED:
      return "border-transparent bg-purple-700 text-white hover:bg-purple-700/80";
    case constData.paymentModes.ONLINE:
    case constData.paymentModes.online:
    case constData.paymentModes.ONLINE_PAYMENT:
      return "border-transparent bg-green-700 text-white hover:bg-green-700/80";
    default:
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  }
};
