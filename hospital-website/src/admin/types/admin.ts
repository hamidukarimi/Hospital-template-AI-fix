export type AdminRole = "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface AdminAuthResponse {
  token: string;
  admin: AdminUser;
}

export interface DashboardStats {
  services: number;
  doctors: number;
  articles: number;
  testimonials: number;
  helpCards: number;
  whyChooseUs: number;
  labTests: number;
  socialMedia: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export type CrudStatus = "ACTIVE" | "INACTIVE" | "DRAFT" | "PUBLISHED";

export interface CrudRecord {
  id: string;
  isActive?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}
