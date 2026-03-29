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

export const getPatientPrescriptions = async () => {
  const patientId = await getPatientIdFromToken();
  if (!patientId) {
    // Negative case. User will not be seeing this page if the token is not present
    redirect("/login?expired=true");
  }
  const response = await request(`/prescriptions/${patientId}`);
  const data = await response.json();
  return data;
};
