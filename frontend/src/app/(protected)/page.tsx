import { getPatientDetails } from "@/lib/patients"

export default async function HomePage() {

    const patient = await getPatientDetails()
    console.log({patient})

    return <main className="wrapper py-8">
        <h1 className="heading mb-6">Patient Details</h1>

    </main>
}
