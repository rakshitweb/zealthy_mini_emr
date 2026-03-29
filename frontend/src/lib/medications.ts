"use server";

import { request } from "@/utils/request";

export type Medication = {
  id: number;
  name: string;
};

export type Dosage = {
  id: number;
  value: string;
};

export async function getMedications(): Promise<Medication[]> {
  const response = await request("/medications");
  return response.json();
}

export async function getDosages(): Promise<Dosage[]> {
  const response = await request("/dosages");
  return response.json();
}
