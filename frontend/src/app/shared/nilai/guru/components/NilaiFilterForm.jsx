import { Search } from 'lucide-react';

export default function NilaiFilterForm({ meta, kelasList, mapelList, loading, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="form-panel glass p-6">
      <h3 className="font-semibold mb-4">Pilih Konteks Penilaian</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="input-group">
          <label>Kelas *</label>
          <select name="id_kelas" value={meta.id_kelas} onChange={onChange} required>
            <option value="">-- Pilih Kelas --</option>
            {kelasList.map((k) => (
              <option key={k.id_kelas} value={k.id_kelas}>
                {k.nama_kelas}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Mata Pelajaran *</label>
          <select name="id_mapel" value={meta.id_mapel} onChange={onChange} required>
            <option value="">-- Pilih Mapel --</option>
            {mapelList.map((m) => (
              <option key={m.id_mapel} value={m.id_mapel}>
                {m.nama_mapel}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Tahun Ajaran *</label>
          <input type="text" name="tahun_ajaran" value={meta.tahun_ajaran} onChange={onChange} required />
        </div>
        <div className="input-group">
          <label>Semester *</label>
          <select name="semester" value={meta.semester} onChange={onChange} required>
            <option value="Ganjil">Ganjil</option>
            <option value="Genap">Genap</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn-primary mt-6" disabled={loading}>
        <Search size={18} /> {loading ? 'Memuat...' : 'Muat Daftar Siswa'}
      </button>
    </form>
  );
}
