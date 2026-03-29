import { getPatientDetails } from "@/lib/patients";
import { getMedications, getDosages } from "@/lib/medications";
import { PatientEditForm } from "./PatientEditForm";

export default async function PatientPage({
    params,
}: {
    params: Promise<{ patientId: string }>;
}) {
    const { patientId } = await params;

    const [patient, medications, dosages] = await Promise.all([
        getPatientDetails(patientId),
        getMedications(),
        getDosages(),
    ]);

    return <main className="wrapper py-8">
        <div>
            <h1 className="heading mb-1">Patient Edit Portal</h1>
        </div>
        <PatientEditForm patient={patient} medications={medications} dosages={dosages} />
    </main>
}
