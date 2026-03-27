"use server"

import { pagination } from "@/config/config";

export type Patient = {
    id: number;
    name: string;
    email: string;
};

export type Appointment = {
    id: number;
    patient_id: number;
    provider: string;
    datetime: string;
    repeat: "daily" | "weekly" | "monthly";
};

export type PatientDetail = {
    id: number;
    name: string;
    email: string;
    appointments: Appointment[];
};

export type PaginatedPatients = {
    patients: Patient[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

const dummyPatients: Patient[] = [
    { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com" },
    { id: 2, name: "Bob Smith", email: "bob.smith@example.com" },
    { id: 3, name: "Carol White", email: "carol.white@example.com" },
    { id: 4, name: "David Brown", email: "david.brown@example.com" },
    { id: 5, name: "Eva Martinez", email: "eva.martinez@example.com" },
    { id: 6, name: "Frank Wilson", email: "frank.wilson@example.com" },
    { id: 7, name: "Grace Lee", email: "grace.lee@example.com" },
    { id: 8, name: "Henry Taylor", email: "henry.taylor@example.com" },
    { id: 9, name: "Isla Anderson", email: "isla.anderson@example.com" },
    { id: 10, name: "Jack Thomas", email: "jack.thomas@example.com" },
    { id: 11, name: "Karen Moore", email: "karen.moore@example.com" },
    { id: 12, name: "Liam Jackson", email: "liam.jackson@example.com" },
];

export async function getPatient(id: number): Promise<PatientDetail | null> {
    const res = await fetch(`http://localhost:8000/api/v1/patients/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
}

export async function getPaginatedPatients(page: number, pageSize: number = pagination.PAGE_SIZE): Promise<PaginatedPatients> {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const total = dummyPatients.length;
    const totalPages = Math.ceil(total / pageSize);
    const patients = dummyPatients.slice((page - 1) * pageSize, page * pageSize);
    return { patients, total, page, pageSize, totalPages };
}
