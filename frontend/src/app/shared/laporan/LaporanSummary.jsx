import RekapAbsensiCard from '../components/RekapAbsensiCard';

export default function LaporanSummary({ jenis, summary }) {
  if (!summary) return null;

  if (jenis === 'absensi_siswa' || jenis === 'absensi_guru') {
    return <RekapAbsensiCard rekap={summary} title="Ringkasan" />;
  }

  const scalarEntries = Object.entries(summary).filter(
    ([, val]) => !Array.isArray(val) && typeof val !== 'object'
  );

  return (
    <div className="mt-6 space-y-4">
      {scalarEntries.length > 0 && (
        <div className="stats-info-grid">
          {scalarEntries.map(([key, val]) => (
            <div className="stat-box glass border-blue" key={key}>
              <div className="stat-content">
                <div className="stat-value">{val ?? '-'}</div>
                <div className="stat-label capitalize">{key.replace(/_/g, ' ')}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {summary.per_predikat && (
        <div className="glass p-4">
          <h4 className="font-semibold mb-2">Per predikat</h4>
          <ul className="space-y-1 text-sm">
            {summary.per_predikat.map((p) => (
              <li key={p.predikat}>
                {p.predikat}: <strong>{p.total}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
      {summary.per_kelas && summary.per_kelas.length > 0 && (
        <div className="glass p-4">
          <h4 className="font-semibold mb-2">Per kelas</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Kelas</th>
                <th>Total</th>
                {summary.per_kelas[0]?.rata_rata !== undefined && <th>Rata-rata</th>}
              </tr>
            </thead>
            <tbody>
              {summary.per_kelas.map((k) => (
                <tr key={k.id_kelas ?? k.nama_kelas}>
                  <td>{k.nama_kelas}</td>
                  <td>{k.total}</td>
                  {k.rata_rata !== undefined && <td>{k.rata_rata}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {summary.per_status && (
        <div className="glass p-4">
          <h4 className="font-semibold mb-2">Per status</h4>
          <ul className="space-y-1 text-sm">
            {summary.per_status.map((p) => (
              <li key={p.status}>
                {p.status}: <strong>{p.total}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
      {summary.per_role && (
        <div className="glass p-4">
          <h4 className="font-semibold mb-2">Per role</h4>
          <ul className="space-y-1 text-sm">
            {summary.per_role.map((p) => (
              <li key={p.role}>
                {p.role}: <strong>{p.total}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
      {summary.per_hari && (
        <div className="glass p-4">
          <h4 className="font-semibold mb-2">Per hari</h4>
          <ul className="space-y-1 text-sm">
            {summary.per_hari.map((p) => (
              <li key={p.hari}>
                {p.hari}: <strong>{p.total}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
