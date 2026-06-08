import { TABLE_COLUMNS } from './constants';

export default function LaporanTable({ jenis, items, meta, loading, onPageChange }) {
  const columns = TABLE_COLUMNS[jenis] || [];

  return (
    <div className="table-container glass mt-6">
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center p-6">
                Memuat...
              </td>
            </tr>
          ) : items?.length > 0 ? (
            items.map((row, i) => (
              <tr key={row.id_nilai || row.id_absensi || row.id_user || row.id_pendaftaran || row.id_jadwal || i}>
                <td>{((meta?.current_page || 1) - 1) * (meta?.per_page || 25) + i + 1}</td>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center p-6 text-secondary">
                Tidak ada data untuk filter ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {meta && meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-4 p-4">
          <button
            type="button"
            className="btn-outline"
            disabled={meta.current_page <= 1}
            onClick={() => onPageChange(meta.current_page - 1)}
          >
            Sebelumnya
          </button>
          <span className="self-center text-sm">
            Halaman {meta.current_page} / {meta.last_page} ({meta.total} data)
          </span>
          <button
            type="button"
            className="btn-outline"
            disabled={meta.current_page >= meta.last_page}
            onClick={() => onPageChange(meta.current_page + 1)}
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}
