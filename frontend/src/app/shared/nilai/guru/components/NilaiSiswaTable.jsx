import { Save, ArrowLeft } from 'lucide-react';

const FIELDS = [
  { key: 'nilai_tugas', label: 'Tugas' },
  { key: 'nilai_uts', label: 'UTS' },
  { key: 'nilai_uas', label: 'UAS' },
  { key: 'nilai_praktik', label: 'Praktik' },
  { key: 'nilai_sikap', label: 'Sikap' },
];

export default function NilaiSiswaTable({ siswaRows, saving, onChange, onSave, onBack }) {
  return (
    <div className="form-panel glass p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Input Nilai Siswa (0–100)</h3>
        <button type="button" onClick={onBack} className="btn-outline">
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>
      <div className="table-container overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NISN</th>
              {FIELDS.map((f) => (
                <th key={f.key}>{f.label}</th>
              ))}
              <th>Akhir</th>
              <th>Predikat</th>
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
                {FIELDS.map((f) => (
                  <td key={f.key}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="w-16"
                      value={row[f.key]}
                      onChange={(e) => onChange(row.id_user_siswa, f.key, e.target.value)}
                      required={f.key !== 'nilai_praktik' && f.key !== 'nilai_sikap'}
                    />
                  </td>
                ))}
                <td>{row.nilai_akhir ?? '-'}</td>
                <td>
                  {row.predikat ? (
                    <span className="badge badge-success">{row.predikat}</span>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-secondary text-sm mt-2">
        Nilai akhir dan predikat dihitung otomatis saat disimpan. Praktik opsional (mengubah bobot).
      </p>
      <button type="button" onClick={onSave} className="btn-primary mt-6" disabled={saving}>
        <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Nilai'}
      </button>
    </div>
  );
}
