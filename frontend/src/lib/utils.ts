import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  browserName,
  browserVersion,
  mobileModel,
} from "mobile-device-detect";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatMoneyCurrency = (value: any, locale = "en-PH", currency = "PHP") => {
  if (value === null || value === undefined) return "";

  const number = typeof value === "string"
    ? Number(value.replace(/,/g, ""))
    : value;

  if (isNaN(number)) return "";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(number);
};

export const formatMoney = (value: any) => {
  if (value === null || value === undefined) return "";

  const number = typeof value === "string"
    ? Number(value.replace(/,/g, ""))
    : value;

  if (isNaN(number)) return "";

  return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  }).format(number);
};

export const getDeviceInfo = async () => {
  const UserAgent = {
    model: mobileModel,
    platform: browserName,
    platformVersion: browserVersion,
  };

  return UserAgent;
};

