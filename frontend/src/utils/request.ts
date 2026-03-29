import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
};

export const request = async (
  url_path: string,
  { method = "GET", headers, body, params }: RequestOptions = {},
) => {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ).toString()
    : "";

  const token = (await cookies()).get("access_token")?.value;
  const authHeader: Record<string, string> = token
    ? { Authorization: token }
    : {};

  let response: Response;
  try {
    response = await fetch(
      `${process.env.BACKEND_URL}/api/v1${url_path}${query}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
    );
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  if (response.status === 401 && url_path !== "/auth/login") {
    redirect("/login?expired=true");
  }

  return response;
};

