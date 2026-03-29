"use server";

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

export type AppointmentCreate = {
  provider: string;
  datetime: string;
  repeat: Repeat;
};

export type AppointmentUpdate = Partial<AppointmentCreate>;

export const getPatientAppointments = async () => {
  const patientId = await getPatientIdFromToken();
  if (!patientId) {
    redirect("/login?expired=true");
  }
  const response = await request(`/appointments/${patientId}`);
  return response.json();
};

export const createAppointment = async (patientId: string, body: AppointmentCreate): Promise<Appointment> => {
  const response = await request(`/appointments/${patientId}`, { method: "POST", body });
  return response.json();
};

export const updateAppointment = async (appointmentId: string, body: AppointmentUpdate): Promise<Appointment> => {
  const response = await request(`/appointments/${appointmentId}`, { method: "PUT", body });
  const data = await response.json();
  return data;
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  await request(`/appointments/${appointmentId}`, { method: "DELETE" });
};
