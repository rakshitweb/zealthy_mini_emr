type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
};

export const request = async (
  url_path: string,
  { method = "GET", headers, body }: RequestOptions = {},
) => {
  let response: Response;
  try {
    response = await fetch(`${process.env.BACKEND_URL}/api/v1${url_path}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  return response;
};

