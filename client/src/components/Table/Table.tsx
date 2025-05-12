import React from 'react';

interface Column<T> {
    key: string;
    title: string;
    render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    containerStyle?: string;
    headerStyle?: string;
    rowStyle?: string;
    cellStyle?: string;
}

function Table<T>({
    columns,
    data,
    loading = false,
    emptyMessage = 'No data available',
    containerStyle = '',
    headerStyle = '',
    rowStyle = '',
    cellStyle = '',
}: TableProps<T>) {
    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center p-4 text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${containerStyle}`}>
            <table className="table">
                <thead>
                    <tr className={headerStyle}>
                        {columns.map((column) => (
                            <th key={column.key} className={cellStyle}>
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className={rowStyle}>
                            {columns.map((column) => (
                                <td key={column.key} className={cellStyle}>
                                    {column.render
                                        ? column.render(item)
                                        : (item as any)[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table; 