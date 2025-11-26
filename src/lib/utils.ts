import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDDMMYYY = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const formatNumberWithCommas = (
  number: number | string = 0,
  options: { minDigit?: number; maxDigit?: number } = {}
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
