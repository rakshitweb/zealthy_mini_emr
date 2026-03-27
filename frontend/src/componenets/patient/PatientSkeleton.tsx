export const PatientsTableSkeleton = () => {
    return (
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
                    <tr>
                        <td colSpan={3} className="border border-border px-4 py-4 text-center text-muted-foreground">
                            Loading...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}