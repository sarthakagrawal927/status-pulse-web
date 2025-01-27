import axios, { AxiosError, AxiosResponse } from "axios";
import { getAuthHeader } from "./token";

// const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
const baseUrl = "http://localhost:3000";

export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

type HTTPMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

// Types for API responses
export interface ApiResponse<T> {
  data: T | null;
  err: AxiosResponse | null;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // This is important for sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export const callApi = async <Input, Output>(
  url: string,
  body?: Input,
  method: HTTPMethod = HTTP_METHOD.POST
): Promise<ApiResponse<Output>> => {
  try {
    const headers: Record<string, string> = {
      // Cookies are sent automatically with the axios instance configuration
      // No need to include Authorization header if it's not required
      // ...getAuthHeader(),
    };

    const { data }: AxiosResponse<Output> = await api({
      url,
      method,
      data: body,
      headers,
    });

    return { data, err: null };
  } catch (err) {
    return { data: null, err: (err as AxiosError).response as AxiosResponse };
  }
};

// Example usage for auth endpoints
export const API_FUNCTIONS = {
  login: async (email: string, password: string) =>
    callApi<
      { email: string; password: string },
      { user: any; organization: any; token: string }
    >("/api/auth/login", { email, password }, HTTP_METHOD.POST),

  register: async (
    email: string,
    password: string,
    name: string,
    organizationName: string
  ) =>
    callApi<
      {
        email: string;
        password: string;
        name: string;
        organizationName: string;
      },
      { user: any; organization: any; token: string }
    >(
      "/api/auth/register",
      { email, password, name, organizationName },
      HTTP_METHOD.POST
    ),

  logout: async () => {
    callApi("/api/auth/logout", undefined, HTTP_METHOD.POST);
  },

  me: async () =>
    callApi<void, { user: any; organization: any }>(
      "/api/auth/me",
      undefined,
      HTTP_METHOD.GET
    ),

  // Team management
  getTeamMembers: async () =>
    callApi<void, any[]>("/api/team", undefined, HTTP_METHOD.GET),

  inviteTeamMember: async (data: {
    email: string;
    name: string;
    role: string;
  }) =>
    callApi<{ email: string; name: string; role: string }, any>(
      "/api/team/invite",
      data,
      HTTP_METHOD.POST
    ),

  updateTeamMember: async (userId: string, data: { role: string }) =>
    callApi<{ role: string }, any>(
      `/api/team/${userId}`,
      data,
      HTTP_METHOD.PATCH
    ),

  removeTeamMember: async (userId: string) =>
    callApi<void, any>(`/api/team/${userId}`, undefined, HTTP_METHOD.DELETE),
};
