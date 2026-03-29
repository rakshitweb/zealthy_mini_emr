import { Table } from "../table";
import { prescriptionHeader } from "./utils"

export const PrescriptionTableSkeleton = () => {
    return (
        <div className="overflow-x-auto">
            <Table
                headers={prescriptionHeader}
                noDataText="Loading..."
            />
        </div>
    );
}