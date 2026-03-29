import { Pagination } from "../pagination/Pagination";
import { Table } from "../table";
import { prescriptionHeader } from "./utils"

type PrescriptionTableProps = {
    page?: number;
    prescriptions: {
        id: string;
        next_date: string;
        medication: string;
        dosage: string;
        quantity: number;
        repeat: string;
    }[];
    totalPages?: number;
};

export const PrescriptionTable = async ({ page, prescriptions, totalPages }: PrescriptionTableProps) => {
    return (
        <div>
            <div className="overflow-x-auto">
                <Table headers={prescriptionHeader} rows={prescriptions} noDataText="No prescriptions found." />
            </div>
            {page != undefined && totalPages != undefined && <Pagination page={page} totalPages={totalPages} />}
        </div>
    );
};
