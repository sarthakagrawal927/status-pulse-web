import axios, { AxiosError, AxiosResponse } from "axios";

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

export const callApi = async <Input, Output>(
  url: string,
  body?: Input,
  method: HTTPMethod = HTTP_METHOD.POST
): Promise<ApiResponse<Output>> => {
  try {
    console.log(baseUrl, url, body, method);
    const headers: Record<string, string> = {};
    let processedBody = body;

    headers["Content-Type"] = "application/json";
    processedBody = body;

    const { data }: AxiosResponse<Output> = await axios(`${baseUrl}${url}`, {
      headers,
      method,
      data: processedBody,
      //   withCredentials: true,
    });

    return { data, err: null };
  } catch (err) {
    return { data: null, err: (err as AxiosError).response as AxiosResponse };
  }
};

// Example usage for auth endpoints
export const API_FUNCTIONS = {
  login: async (email: string, password: string) =>
    callApi("/api/auth/login", { email, password }, HTTP_METHOD.POST),

  register: async (
    email: string,
    password: string,
    name: string,
    organizationName: string
  ) =>
    callApi(
      "/api/auth/register",
      { email, password, name, organizationName },
      HTTP_METHOD.POST
    ),
  logout: () => callApi("/api/logout", {}, HTTP_METHOD.POST),
};
