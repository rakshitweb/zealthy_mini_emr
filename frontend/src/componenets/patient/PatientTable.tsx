import { Patient } from "@/lib/patients";
import { Pagination } from "../pagination/Pagination";
import { Table } from "../table";
import { patientTableHeader } from "./utils";

type PatientTableProps = {
  page: number;
  patients: Patient[];
  totalPages: number;
  extraHeaders?: { name: string, label: string }[]
};

export const PatientTable = async ({ extraHeaders = [], page, patients, totalPages }: PatientTableProps) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <Table headers={[...patientTableHeader, ...extraHeaders]} rows={patients} noDataText="No patients found." />
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
};
