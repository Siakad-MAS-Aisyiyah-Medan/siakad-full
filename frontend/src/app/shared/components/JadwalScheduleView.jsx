import { Calendar } from 'lucide-react';

const HARI_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function formatJam(mulai, selesai) {
  const a = (mulai || '').slice(0, 5);
  const b = (selesai || '').slice(0, 5);
  return a && b ? `${a} – ${b}` : '-';
}

function groupByHari(items) {
  const grouped = {};
  HARI_ORDER.forEach((h) => {
    grouped[h] = [];
  });
  items.forEach((item) => {
    const hari = item.hari || 'Senin';
    if (!grouped[hari]) {
      grouped[hari] = [];
    }
    grouped[hari].push(item);
  });
  return grouped;
}

export default function JadwalScheduleView({
  title,
  subtitle,
  items = [],
  showKelas = false,
  showGuru = false,
  emptyMessage = 'Belum ada jadwal untuk ditampilkan.',
}) {
  const grouped = groupByHari(items);
  const hasAny = items.length > 0;

  return (
    <div className="data-panel view-list">
      <div className="panel-header glass">
        <div className="header-text">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      {!hasAny ? (
        <div className="glass mt-6 p-8 text-center text-secondary">
          <Calendar size={40} className="mx-auto mb-3 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {HARI_ORDER.map((hari) => {
            const dayItems = grouped[hari] || [];
            if (dayItems.length === 0) return null;

            return (
              <div key={hari} className="glass overflow-hidden" style={{ borderRadius: '12px' }}>
                <div className="px-4 py-3 border-b" style={{ background: 'var(--color-bg-secondary, #f8fafc)' }}>
                  <span className="badge badge-pending">{hari}</span>
                  <span className="text-secondary text-sm ml-2">{dayItems.length} slot</span>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Jam</th>
                        <th>Mata Pelajaran</th>
                        {showKelas && <th>Kelas</th>}
                        {showGuru && <th>Guru</th>}
                        <th>Ruangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayItems.map((item) => (
                        <tr key={item.id_jadwal}>
                          <td>{formatJam(item.jam_mulai, item.jam_selesai)}</td>
                          <td>
                            <strong>{item.mapel?.nama_mapel || '-'}</strong>
                          </td>
                          {showKelas && <td>{item.kelas?.nama_kelas || '-'}</td>}
                          {showGuru && <td className="text-secondary">{item.guru?.nama_guru || '-'}</td>}
                          <td>{item.ruangan || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
