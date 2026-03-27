import { Patient } from "@/lib/patients";
import { Pagination } from "../pagination/Pagination";
import { Table } from "../table";
import { patientTableHeader } from "./utils";

type PatientTableProps = {
  page: number;
  patients: Patient[];
  totalPages: number
};

export const PatientTable = async ({ page, patients, totalPages }: PatientTableProps) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <Table headers={patientTableHeader} rows={patients} noDataText="No patients found." />
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
};
