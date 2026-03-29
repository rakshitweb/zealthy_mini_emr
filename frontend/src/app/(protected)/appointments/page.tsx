import { getPatientAppointments } from "@/lib/appointments"
import { generateAppointmentSequence } from "@/utils/utils";
import { pagination } from "@/config/config";
import { Suspense } from "react";
import { AppointmentsTableSkeleton, AppointmentTable } from "@/componenets";

export default async function AppointmentsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page } = await searchParams;
    const currentPage = Math.max(1, parseInt(page ?? "1"));
    const appointments = await getPatientAppointments();

    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 3)

    const next_appointments = generateAppointmentSequence(appointments, endDate)

    const start = (currentPage - 1) * pagination.PAGE_SIZE;
    const paginated = next_appointments.slice(start, start + pagination.PAGE_SIZE);
    const totalPages = Math.ceil(next_appointments.length / pagination.PAGE_SIZE);

    return <main className="wrapper py-8">
        <div className="mb-4">
            <h1 className="heading mb-1">Your Appointments</h1>
            <p className="caption">Showing next 3 months appointments</p>
        </div>
        <Suspense fallback={<AppointmentsTableSkeleton />}>
            <AppointmentTable appointments={paginated} page={currentPage} totalPages={totalPages} />
        </Suspense>
    </main>
}