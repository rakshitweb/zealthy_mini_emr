type Header = {
    name: string;
    label: string;
};

type Row = {
    id: string;
    [key: string]: unknown;
};

type TableProps = {
    className?: string;
    headers: Header[];
    rows?: Row[];
    rowClassName?: string;
    noDataText?: string;
};

export const Table = ({ className, headers, rows = [], noDataText, rowClassName }: TableProps) => {
    return (
        <table className={`w-full border-collapse border border-border text-sm ${className ?? ""}`}>
            <thead>
                <tr className="text-left">
                    {headers.map((header) => (
                        <th key={header.name} className="border border-border px-4 py-2">
                            {header.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.length ? (
                    rows.map((row) => (
                        <tr key={row.id} className={`transition-colors hover:bg-table-hover ${rowClassName ?? ""}`}>
                            {headers.map(({ name }) => (
                                <td key={`${row.id}_${name}`} className="border border-border px-4 py-2">
                                    {row[name] as React.ReactNode}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={headers.length} className="border border-border px-4 py-4 text-center">
                            {noDataText ?? "No data found."}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};
