"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { request } from "@/utils/request";

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.detail ?? "Login failed. Please try again.");
  }
  (await cookies()).set(
    "access_token",
    `${data.token_type} ${data.access_token}`,
    { path: "/" },
  );
  redirect("/");
}

export async function logout(): Promise<void> {
  (await cookies()).delete("access_token");
  redirect("/login");
}

