import { Save, X } from 'lucide-react';
import { guruLabel } from '@app/shared/utils/guruLabel';

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function JadwalForm({
  view,
  formData,
  kelasData,
  mapelData,
  guruData,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="form-panel glass">
      <div className="panel-header border-b">
        <h2>{view === 'add' ? 'Tambah Jadwal' : 'Edit Jadwal'}</h2>
      </div>

      <form onSubmit={onSubmit} className="custom-form p-6 mt-4">
        <div className="input-group full">
          <label>
            Kelas <span className="text-red-500">*</span>
          </label>
          <select name="id_kelas" value={formData.id_kelas} onChange={onChange} required>
            <option value="">-- Pilih Kelas --</option>
            {kelasData.map((k) => (
              <option key={k.id_kelas} value={k.id_kelas}>
                {k.nama_kelas}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group full mt-4">
          <label>
            Mata Pelajaran <span className="text-red-500">*</span>
          </label>
          <select name="id_mapel" value={formData.id_mapel} onChange={onChange} required>
            <option value="">-- Pilih Mapel --</option>
            {mapelData.map((m) => (
              <option key={m.id_mapel} value={m.id_mapel}>
                {m.nama_mapel}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group full mt-4">
          <label>
            Guru Pengampu <span className="text-red-500">*</span>
          </label>
          <select name="id_guru" value={formData.id_guru} onChange={onChange} required>
            <option value="">-- Pilih Guru --</option>
            {guruData.map((g) => (
              <option key={g.id_user} value={g.id_user}>
                {guruLabel(g)}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group full mt-4">
          <label>
            Hari <span className="text-red-500">*</span>
          </label>
          <select name="hari" value={formData.hari} onChange={onChange} required>
            {HARI.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group full mt-4">
          <label>
            Jam Mulai <span className="text-red-500">*</span>
          </label>
          <input type="time" name="jam_mulai" value={formData.jam_mulai} onChange={onChange} required />
        </div>

        <div className="input-group full mt-4">
          <label>
            Jam Selesai <span className="text-red-500">*</span>
          </label>
          <input type="time" name="jam_selesai" value={formData.jam_selesai} onChange={onChange} required />
        </div>

        <div className="input-group full mt-4">
          <label>Ruangan</label>
          <input
            type="text"
            name="ruangan"
            value={formData.ruangan}
            onChange={onChange}
            placeholder="Contoh: Lab Komputer"
          />
        </div>

        <div className="input-group full mt-4">
          <label>
            Tahun Ajaran <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tahun_ajaran"
            value={formData.tahun_ajaran}
            onChange={onChange}
            placeholder="2025/2026"
            required
          />
        </div>

        <div className="input-group full mt-4">
          <label>
            Semester <span className="text-red-500">*</span>
          </label>
          <select name="semester" value={formData.semester} onChange={onChange} required>
            <option value="Ganjil">Ganjil</option>
            <option value="Genap">Genap</option>
          </select>
        </div>

        <div className="form-footer mt-8">
          <button type="button" onClick={onCancel} className="btn-outline">
            <X size={18} /> Batal
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}

