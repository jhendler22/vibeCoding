import { ReactNode } from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  rows: T[];
  columns: Column<T>[];
  sortKey: keyof T;
  sortDir: 'asc' | 'desc';
  onSort: (key: keyof T) => void;
}

export function DataTable<T extends object>({ rows, columns, sortKey, sortDir, onSort }: DataTableProps<T>) {
  return (
    <div className="table-wrap panel">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>
                {column.sortable ? (
                  <button onClick={() => onSort(column.key)}>
                    {column.label} {sortKey === column.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((column) => (
                <td key={String(column.key)}>{column.render ? column.render(row) : String(row[column.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
