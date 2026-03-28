"use server";

import { cookies } from "next/headers";

export async function getPatientIdFromToken(): Promise<number | null> {
  const tokenValue = (await cookies()).get("access_token")?.value;
  if (!tokenValue) return null;
  try {
    const base64Payload = tokenValue.replace("Bearer ", "").split(".")[1];
    const payload = JSON.parse(Buffer.from(base64Payload, "base64url").toString());
    return payload?.data?.id ?? null;
  } catch {
    return null;
  }
}
