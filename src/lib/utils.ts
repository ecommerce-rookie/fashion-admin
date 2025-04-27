import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number | null | undefined): string {
  if (!input) return "";

  const date = new Date(input);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(
  amount: number | string,
  currency: string = "VND",
  locale: string = "vi-VN"
): string {
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
