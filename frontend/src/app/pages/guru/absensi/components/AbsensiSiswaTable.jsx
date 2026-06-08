import { Save, ArrowLeft } from 'lucide-react';
import { ABSENSI_STATUS } from '@app/shared/constants/absensiStatus';

export default function AbsensiSiswaTable({ siswaRows, saving, onStatusChange, onSave, onBack }) {
  return (
    <div className="form-panel glass p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Input Status Absensi Siswa</h3>
        <button type="button" onClick={onBack} className="btn-outline">
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>NISN</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {siswaRows.map((row, i) => (
              <tr key={row.id_user_siswa}>
                <td>{i + 1}</td>
                <td>
                  <strong>{row.nama_siswa}</strong>
                </td>
                <td>{row.nisn || '-'}</td>
                <td>
                  <select
                    value={row.status || 'H'}
                    onChange={(e) => onStatusChange(row.id_user_siswa, e.target.value)}
                    className="w-full"
                  >
                    {ABSENSI_STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={onSave} className="btn-primary mt-6" disabled={saving}>
        <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Absensi'}
      </button>
    </div>
  );
}
