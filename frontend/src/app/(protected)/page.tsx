import { AppointmentsTableSkeleton, AppointmentTable, PrescriptionTable, PrescriptionTableSkeleton, Table } from "@/componenets";
import { pagination } from "@/config/config";
import { getPatientDetails } from "@/lib/patients";
import { generateAppointmentSequence, generatePrescriptionSequence } from "@/utils/utils";
import { Suspense } from "react";

export default async function HomePage() {
    const patient = await getPatientDetails();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const next_appointments = generateAppointmentSequence(patient.appointments || [], endDate, pagination.PAGE_SIZE);

    const next_prescriptions = generatePrescriptionSequence(patient.prescriptions || [], endDate, pagination.PAGE_SIZE)

    return (
        <main className="wrapper py-8 flex flex-col gap-8">
            <div>
                <h1 className="heading mb-1">Patient Portal</h1>
                <p className="caption">Welcome back, {patient.name}</p>
            </div>

            <section>
                <h2 className="subheading mb-4">Personal Information</h2>
                <div className="flex gap-6 flex-wrap">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted uppercase tracking-wide">Name</span>
                        <span className="text-sm font-medium">{patient.name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted uppercase tracking-wide">Email</span>
                        <span className="text-sm font-medium">{patient.email}</span>
                    </div>
                </div>
            </section>

            <section className="flex flex-wrap gap-4">
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="subheading">Upcoming Appointments (Next 7 Days)</h2>
                        <a href="/appointments">View More</a>
                    </div>
                    <Suspense fallback={<AppointmentsTableSkeleton />}>
                        <AppointmentTable appointments={next_appointments} />
                    </Suspense>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="subheading">Upcoming Medications (Next 7 Days)</h2>
                        <a href="/prescriptions">View More</a>
                    </div>
                    <Suspense fallback={<PrescriptionTableSkeleton />}>
                        <PrescriptionTable prescriptions={next_prescriptions} />
                    </Suspense>
                </div>
            </section>
            <p className="mt-4 caption">Note: Maximum showing {pagination.PAGE_SIZE} rows. To see complete list, please click on show more button.</p>
        </main>
    );
}
