import { Metadata } from "next";
import { Suspense } from "react";
import { PatientsTableSkeleton, PatientTable } from "@/componenets";

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

    return (
        <main className="wrapper py-8">
            <h1 className="heading mb-6">Patients</h1>
            <Suspense fallback={<PatientsTableSkeleton />} key={currentPage}>
                <PatientTable page={currentPage} />
            </Suspense>
        </main>
    );
}
