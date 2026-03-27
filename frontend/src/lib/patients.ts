"use server";

import { pagination } from "@/config/config";
import { request } from "@/utils/request";

export type Patient = {
  id: string;
  name: string;
  email: string;
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

