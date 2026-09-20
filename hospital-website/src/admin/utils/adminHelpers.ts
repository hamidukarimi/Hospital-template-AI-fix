import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BriefcaseMedical,
  Building2,
  FileText,
  GraduationCap,
  HeartPulse,
  Info,
  Link,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Users,
  WalletCards,
} from "lucide-react";

export const API_ORIGIN = "https://hospital-template-backend.onrender.com";

export const getImageUrl = (image?: string | null) => {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) return image;

  if (image.startsWith("/")) {
    return `${API_ORIGIN}${image}`;
  }

  return `${API_ORIGIN}/uploads/${image}`;
};

export type AdminIconKey =
  | "service"
  | "doctor"
  | "article"
  | "testimonial"
  | "help"
  | "why"
  | "lab"
  | "social"
  | "settings"
  | "profile"
  | "link";

export const adminIconMap: Record<AdminIconKey, LucideIcon> = {
  service: BriefcaseMedical,
  doctor: Stethoscope,
  article: FileText,
  testimonial: HeartPulse,
  help: ShieldCheck,
  why: Activity,
  lab: Microscope,
  social: Users,
  settings: Building2,
  profile: WalletCards,
  link: Link,
};

export const helperIconMap: Record<string, LucideIcon> = {
  service: BriefcaseMedical,
  doctor: GraduationCap,
  article: FileText,
  testimonial: HeartPulse,
  help: ShieldCheck,
  why: Activity,
  lab: Microscope,
  settings: Building2,
  default: Info,
};

export const formatCurrency = (value: number | string | null | undefined) => {
  const numericValue = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

export const formatDate = (value?: string | Date | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const normalizeBoolean = (value: unknown) => {
  return Boolean(value === true || value === "true" || value === 1);
};

export const toIdentifier = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/** Shared layout classes so admin create/edit forms stay within the viewport on mobile. */
export const adminFormPageWrap = {
  sm: "mx-auto w-full min-w-0 max-w-3xl",
  md: "mx-auto w-full min-w-0 max-w-4xl",
  lg: "mx-auto w-full min-w-0 max-w-5xl",
} as const;

export const adminFormClass =
  "min-w-0 max-w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm [&_input]:min-w-0 [&_input]:max-w-full [&_select]:min-w-0 [&_select]:max-w-full [&_textarea]:min-w-0 [&_textarea]:max-w-full";

export const adminFormGridClass =
  "grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2";

export const adminFormActionsClass =
  "mt-6 flex min-w-0 flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end";
