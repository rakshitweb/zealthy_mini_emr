import { getPaginatedPatients } from "@/lib/patients";
import { Pagination } from "../pagination/Pagination";

type PatientTableProps = {
  page: number;
};

export const PatientTable = async ({ page }: PatientTableProps) => {
  const { patients, totalPages } = await getPaginatedPatients(page);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="border border-border px-4 py-2">ID</th>
              <th className="border border-border px-4 py-2">Name</th>
              <th className="border border-border px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr className="transition-colors hover:bg-table-hover">
                <td colSpan={3} className="border border-border px-4 py-4 text-center text-muted-foreground">
                  No patients found.
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} className="transition-colors hover:bg-table-hover">
                  <td className="border border-border px-4 py-2">{patient.id}</td>
                  <td className="border border-border px-4 py-2">{patient.name}</td>
                  <td className="border border-border px-4 py-2">{patient.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
};
