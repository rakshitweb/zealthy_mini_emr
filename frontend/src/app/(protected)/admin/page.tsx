import { Metadata } from "next";
import { Suspense } from "react";
import { PatientsTableSkeleton, PatientTable, View } from "@/componenets";
import { getPaginatedPatients } from "@/lib/patients";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const metadata: Metadata = {
    title: "Admin Portal - Mini EMR",
    description: "Mini Electronic Medical Records",
};

type AdminPageProps = {
    searchParams: Promise<{ page?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
    const { page } = await searchParams;
    const currentPage = Math.max(1, parseInt(page ?? "1"));

    let patients: Awaited<ReturnType<typeof getPaginatedPatients>>["patients"] = [];
    let totalPages = 1;

    try {
        const data = await getPaginatedPatients(currentPage);
        patients = data.patients;
        totalPages = data.totalPages;
    } catch (error) {
        if (isRedirectError(error)) throw error;
    }

    return (
        <main className="wrapper py-8">
            <div className="flex justify-between-items-center">
                <h1 className="heading mb-6">Patients</h1>
            </div>
            <Suspense fallback={<PatientsTableSkeleton />} key={currentPage}>
                <PatientTable extraHeaders={[{ name: "actions", label: "Actions" }]} page={currentPage} patients={patients.map(patient => ({
                    ...patient, actions: <div className="flex justify-center items-center">
                        <a href={`/admin/patient/${patient.id}`}><View /></a>
                    </div>
                }))} totalPages={totalPages} />
            </Suspense>
        </main>
    );
}
