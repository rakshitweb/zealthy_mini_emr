import { generatePrescriptionSequence } from "@/utils/utils";
import { pagination } from "@/config/config";
import { Suspense } from "react";
import { getPatientPrescriptions } from "@/lib/prescriptions";
import { PrescriptionTable, PrescriptionTableSkeleton } from "@/componenets";

export default async function PrescriptionsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page } = await searchParams;
    const currentPage = Math.max(1, parseInt(page ?? "1"));
    const prescriptions = await getPatientPrescriptions();
    console.log({ prescriptions })
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 3)

    const next_prescription = generatePrescriptionSequence(prescriptions, endDate)

    const start = (currentPage - 1) * pagination.PAGE_SIZE;
    const paginated = next_prescription.slice(start, start + pagination.PAGE_SIZE);
    const totalPages = Math.ceil(next_prescription.length / pagination.PAGE_SIZE);

    return <main className="wrapper py-8">
        <div className="mb-4">
            <h1 className="heading mb-1">Your Prescriptions</h1>
            <p className="caption">Showing next 3 months appointments</p>
        </div>
        <Suspense fallback={<PrescriptionTableSkeleton />}>
            <PrescriptionTable prescriptions={paginated} page={currentPage} totalPages={totalPages} />
        </Suspense>
    </main>
}