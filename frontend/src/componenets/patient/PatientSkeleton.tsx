import { Table } from "../table";
import { patientTableHeader } from "./utils";

export const PatientsTableSkeleton = () => {
    return (
        <div className="overflow-x-auto">
            <Table
                headers={patientTableHeader}
                noDataText="Loading..."
            />
        </div>
    );
}