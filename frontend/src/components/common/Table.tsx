interface Column {
  key: string;
  title: string;
  render?: (value: any, record: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

export function Table({
  columns,
  data,
  loading,
  emptyMessage = 'No data available'
}: TableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={`${index}-${column.key}`}>
                    {column.render
                      ? column.render(record[column.key], record)
                      : record[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 