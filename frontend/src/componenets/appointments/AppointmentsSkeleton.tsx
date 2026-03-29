import { Table } from "../table";
import { appointmentHeader } from "./utils";

export const AppointmentsTableSkeleton = () => {
    return (
        <div className="overflow-x-auto">
            <Table
                headers={appointmentHeader}
                noDataText="Loading..."
            />
        </div>
    );
}