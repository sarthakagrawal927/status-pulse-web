import {
  type CreateIncidentData,
  type CreateServiceData,
  type CreateUpdateData,
  Incident,
  IncidentUpdate,
} from "@/types";
import axios, { AxiosError, AxiosResponse } from "axios";

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

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

  inviteTeamMember: async (data: { email: string; role: string }) =>
    callApi<{ email: string; role: string }, any>(
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
    callApi<void, void>(`/api/team/${userId}`, undefined, HTTP_METHOD.DELETE),

  // Service management
  getServices: async (organizationId: string = "") =>
    callApi<void, any[]>(
      `/api/services?organizationId=${organizationId}`,
      undefined,
      HTTP_METHOD.GET
    ),

  getServiceById: async (id: string) =>
    callApi<void, any>(`/api/services/${id}`, undefined, HTTP_METHOD.GET),

  createService: async (data: CreateServiceData) =>
    callApi<CreateServiceData, any>("/api/services", data, HTTP_METHOD.POST),

  updateService: async (id: string, data: Partial<CreateServiceData>) =>
    callApi<Partial<CreateServiceData>, any>(
      `/api/services/${id}`,
      data,
      HTTP_METHOD.PATCH
    ),

  deleteService: async (id: string) =>
    callApi<void, void>(`/api/services/${id}`, undefined, HTTP_METHOD.DELETE),

  // Incident management
  getIncidents: async () => {
    return callApi<null, CreateIncidentData[]>(
      "/api/incidents",
      null,
      HTTP_METHOD.GET
    );
  },

  getIncidentById: async (id: string) => {
    return callApi<null, CreateIncidentData>(
      `/api/incidents/${id}`,
      null,
      HTTP_METHOD.GET
    );
  },

  createIncident: async (data: CreateIncidentData) => {
    return callApi<CreateIncidentData, Incident>("/api/incidents", data);
  },

  updateIncident: async (id: string, data: Partial<CreateIncidentData>) => {
    return callApi<Partial<CreateIncidentData>, CreateIncidentData>(
      `/api/incidents/${id}`,
      data,
      HTTP_METHOD.PATCH
    );
  },

  deleteIncident: async (id: string) => {
    return callApi<null, void>(
      `/api/incidents/${id}`,
      null,
      HTTP_METHOD.DELETE
    );
  },

  // Incident Updates
  createIncidentUpdate: async (incidentId: string, data: CreateUpdateData) => {
    return callApi<CreateUpdateData, IncidentUpdate>(
      `/api/incidents/${incidentId}/updates`,
      data
    );
  },

  getIncidentUpdates: async (incidentId: string) => {
    return callApi<null, CreateUpdateData[]>(
      `/api/incidents/${incidentId}/updates`,
      null,
      HTTP_METHOD.GET
    );
  },

  // Organization
  getOrganizationById: async (organizationId: string) => {
    return callApi<void, any>(
      `/api/organizations/${organizationId}`,
      undefined,
      HTTP_METHOD.GET
    );
  },

  // User Actions
  getUserActions: async (organizationId: string = "") => {
    return callApi<void, any>(
      `/api/actions?organizationId=${organizationId}`,
      undefined,
      HTTP_METHOD.GET
    );
  },
};
