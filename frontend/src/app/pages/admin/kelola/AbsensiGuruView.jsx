import React from 'react';
import RekapAbsensiCard from '@app/shared/components/RekapAbsensiCard';
import { useAbsensiGuru } from '@app/shared/absensi/admin-guru/hooks/useAbsensiGuru';

export default function AbsensiGuruView() {
  const { items, rekap, loading, isFetching, absensiStatusLabel } = useAbsensiGuru();

  return (
    <div className="space-y-6">
      <div className="data-panel view-list mb-6">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Absensi Guru</h2>
            <p>Pantau kehadiran guru dan pegawai sekolah per hari.</p>
          </div>
        </div>
      </div>
      
      <RekapAbsensiCard rekap={rekap} title="Rekap Absensi Guru" />

      <div className="table-container glass mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Guru</th>
              <th>Tanggal</th>
              <th>Masuk</th>
              <th>Pulang</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(loading || isFetching) ? (
              <tr>
                <td colSpan="6" className="py-16 text-secondary">
                  <div className="flex flex-col items-center justify-center w-full">
                    <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid #e2e8f0', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p className="mt-2 text-center">Memuat data absensi...</p>
                  </div>
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((row, i) => (
                <tr key={row.id_absensi_guru}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{row.guru?.nama_guru || '-'}</strong>
                  </td>
                  <td>{row.tanggal}</td>
                  <td>{(row.jam_masuk || '').slice(0, 5) || '-'}</td>
                  <td>{(row.jam_pulang || '').slice(0, 5) || '-'}</td>
                  <td>{row.status_label || absensiStatusLabel(row.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-16 text-secondary">
                  Belum ada data absensi guru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
