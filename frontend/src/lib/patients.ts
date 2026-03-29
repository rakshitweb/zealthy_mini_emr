"use server";

import { pagination } from "@/config/config";
import { request } from "@/utils/request";
import { getPatientIdFromToken } from "./token";
import { redirect } from "next/navigation";
import { Appointment } from "./appointments";

export type Repeat = "daily" | "weekly" | "monthly";

export type Patient = {
  id: string;
  name: string;
  email: string;
  appointments?: Appointment[];
  prescriptions?: [];
};

export type PaginatedPatients = {
  patients: Patient[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function getPaginatedPatients(
  page: number,
  pageSize: number = pagination.PAGE_SIZE,
): Promise<PaginatedPatients> {
  const response = await request("/patients", {
    method: "GET",
    params: { page, page_size: pageSize },
  });
  const data = await response.json();
  const total: number = data.total;
  const totalPages = Math.ceil(total / pageSize);
  return { patients: data.patients, total, page, pageSize, totalPages };
}

export async function updatePatient(id: string, body: { name?: string; email?: string }): Promise<Patient> {
  const response = await request(`/patients/${id}`, { method: "PUT", body });
  return response.json();
}

export async function getPatientDetails(id?: string): Promise<Patient> {
  const patientId = id || await getPatientIdFromToken();
  if (!patientId) {
    // Negative case. User will not be seeing this page if the token is not present
    redirect("/login?expired=true");
  }
  const response = await request(`/patients/${patientId}`);
  const data = await response.json();
  return data;
}
