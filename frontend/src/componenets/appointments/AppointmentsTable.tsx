import { Pagination } from "../pagination/Pagination";
import { Table } from "../table";
import { appointmentHeader } from "./utils";

type AppointmentTableProps = {
    page?: number;
    appointments: { id: string, provider: string, next_date: string, repeat: string }[];
    totalPages?: number;
};

export const AppointmentTable = ({ page, appointments, totalPages }: AppointmentTableProps) => {
    return (
        <div>
            <div className="overflow-x-auto">
                <Table headers={appointmentHeader} rows={appointments} noDataText="No appointments found." />
            </div>
            {page != undefined && totalPages != undefined && <Pagination page={page} totalPages={totalPages} />}
        </div>
    );
};
