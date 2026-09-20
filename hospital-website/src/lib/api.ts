import type {
  AboutSection,
  Article,
  Doctor,
  FooterSettings,
  HeroSection,
  HelpSection,
  LabTest,
  Service,
  SiteSettings,
  Testimonial,
  WhyChooseUsItem,
} from "../types/api";

const apiBaseUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_URL is not defined. Please add it to your frontend .env file.",
  );
}

const normalizeApiBase = () => apiBaseUrl.replace(/\/+$/, "");

const buildUrl = (path: string) => {
  const cleanedPath = path.replace(/^\/+/, "");
  return `${normalizeApiBase()}/${cleanedPath}`;
};

async function request<T>(path: string): Promise<T | null> {
  const url = buildUrl(path);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      success?: boolean;
      data?: T;
    };

    if (payload.success === false) {
      return null;
    }

    return (payload.data ?? null) as T | null;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    return null;
  }
}

async function postRequest<T, B>(path: string, body: B): Promise<T | null> {
  const url = buildUrl(path);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      success?: boolean;
      data?: T;
    };

    if (payload.success === false) {
      return null;
    }

    return (payload.data ?? null) as T | null;
  } catch (error) {
    console.error(`POST API request failed for ${url}:`, error);
    return null;
  }
}

export const getApiOrigin = () => {
  return new URL(normalizeApiBase()).origin;
};

export const getImageUrl = (path?: string | null): string => {
  if (!path) {
    return "";
  }

  const value = path.trim();

  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  const baseOrigin = getApiOrigin();

  return new URL(value, `${baseOrigin}/`).toString();
};

export const getSiteSettings = () => request<SiteSettings>("/site-settings");

export const getHero = () => request<HeroSection>("/hero");

export const getHelpSection = () => request<HelpSection>("/help");

export const getAboutSection = () => request<AboutSection>("/about");

export const getServices = () => request<Service[]>("/services");

export const getServiceBySlug = (slug: string) =>
  request<Service>(`/services/${encodeURIComponent(slug)}`);

export const getTestimonials = () => request<Testimonial[]>("/testimonials");

export const getWhyChooseUs = () =>
  request<WhyChooseUsItem[]>("/why-choose-us");

export const getLabTests = () => request<LabTest[]>("/lab-tests");

export const getDoctors = () => request<Doctor[]>("/doctors");

export const getArticles = () => request<Article[]>("/articles");

export const getFooter = () => request<FooterSettings>("/footer");

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  message: string;
}

export const submitContactMessage = (payload: ContactSubmissionPayload) =>
  postRequest<{ id: string }, ContactSubmissionPayload>("/contact", payload);