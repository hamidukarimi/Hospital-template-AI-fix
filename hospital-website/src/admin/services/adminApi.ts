const API_BASE_URL = import.meta.env.VITE_API_URL as string;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is not defined");
}

const getToken = () => {
  return localStorage.getItem("adminToken");
};

const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }

  return data.data ?? data;
};

const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};

export default api;

export interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const loginAdmin = (email: string, password: string) => {
  return request<AdminLoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const getCurrentAdmin = () => {
  return request<AdminLoginResponse["admin"]>("/admin/me");
};

export const getDashboardStats = () => {
  return request<{
    services: number;
    doctors: number;
    articles: number;
    testimonials: number;
    helpCards: number;
    whyChooseUs: number;
    labTests: number;
    socialMedia: number;
  }>("/admin/dashboard");
};
