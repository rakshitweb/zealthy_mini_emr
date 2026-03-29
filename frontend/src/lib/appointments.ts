import { redirect } from "next/navigation";
import { Repeat } from "./patients";
import { getPatientIdFromToken } from "./token";
import { request } from "@/utils/request";

export type Appointment = {
  id: string;
  provider: string;
  datetime: Date;
  repeat: Repeat;
  latest_occurrence: Date;
  patient_id?: string;
};

export const getPatientAppointments = async () => {
  const patientId = await getPatientIdFromToken();
  if (!patientId) {
    // Negative case. User will not be seeing this page if the token is not present
    redirect("/login?expired=true");
  }
  const response = await request(`/appointments/${patientId}`);
  const data = await response.json();
  return data;
};
