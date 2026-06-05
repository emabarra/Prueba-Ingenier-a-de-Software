import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState, useMemo } from 'react';

export default function DataTable({ columns, data, pageSize = 10, onRowClick }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / pageSize);

  const pageData = useMemo(() => {
    const start = page * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  if (data.length === 0) {
    return <div className="table-empty">No se encontraron registros</div>;
  }

  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? 'pointer' : undefined }}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="table-pagination">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            <FiChevronLeft />
          </button>
          <span>Pagina {page + 1} de {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
