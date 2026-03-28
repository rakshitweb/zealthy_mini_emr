import { Table } from "@/componenets";
import { pagination } from "@/config/config";
import { getPatientDetails } from "@/lib/patients";
import { generateAppointmentSequence, generatePrescriptionSequence } from "@/utils/utils";

export default async function HomePage() {
    const patient = await getPatientDetails();
    const endDate = new Date();
    console.log({patient})
    endDate.setDate(endDate.getDate() + 7);
    const next_appointments = generateAppointmentSequence(patient.appointments || [], endDate);

    const next_prescriptions = generatePrescriptionSequence(patient.prescriptions || [], endDate)
    
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
                    <h2 className="subheading mb-4">Upcoming Appointments (Next 7 Days)</h2>
                    <div className="overflow-x-auto">
                        <Table
                            headers={[
                                { name: "provider", label: "Provider" },
                                { name: "repeat", label: "Frequency" },
                                { name: "next_date", label: "Next Date" },
                            ]}
                            rows={next_appointments}
                            noDataText="No upcoming appointments in the next 7 days."
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <h2 className="subheading mb-4">Upcoming Medications (Next 7 Days)</h2>
                    <div className="overflow-x-auto">
                        <Table
                            headers={[
                                { name: "medication", label: "Medication" },
                                { name: "dosage", label: "Dosage" },
                                { name: "repeat", label: "Frequency" },
                                { name: "quantity", label: "Quantity" },
                                { name: "next_date", label: "Next Date" },
                            ]}
                            rows={next_prescriptions}
                            noDataText="No upcoming medication refills in the next 7 days."
                        />
                    </div>
                </div>
            </section>
            <p className="mt-4 caption">Note: Maximum showing {pagination.PAGE_SIZE} rows. To see complete list, please click on show more button.</p>
        </main>
    );
}
