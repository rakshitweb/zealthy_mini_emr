"use server";

import { redirect } from "next/navigation";
import { Repeat } from "./patients";
import { getPatientIdFromToken } from "./token";
import { request } from "@/utils/request";

export type Prescription = {
  id: string;
  quantity: number;
  refill_on: string;
  refill_schedule: Repeat;
  latest_occurrence: string;
  medication: { id: number; name: string };
  dosage: { id: number; value: string };
};

export type PrescriptionCreate = {
  medication_id: number;
  dosage_id: number;
  quantity: number;
  refill_on: string;
  refill_schedule: Repeat;
};

export type PrescriptionUpdate = Partial<PrescriptionCreate>;

export const getPatientPrescriptions = async () => {
  const patientId = await getPatientIdFromToken();
  if (!patientId) {
    redirect("/login?expired=true");
  }
  const response = await request(`/prescriptions/${patientId}`);
  return response.json();
};

export const createPrescription = async (patientId: string, body: PrescriptionCreate): Promise<Prescription> => {
  const response = await request(`/prescriptions/${patientId}`, { method: "POST", body });
  return response.json();
};

export const updatePrescription = async (prescriptionId: string, body: PrescriptionUpdate): Promise<Prescription> => {
  const response = await request(`/prescriptions/${prescriptionId}`, { method: "PUT", body });
  return response.json();
};
