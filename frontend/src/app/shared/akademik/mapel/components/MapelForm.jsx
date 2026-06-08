import { Save, X } from 'lucide-react';

export default function MapelForm({ view, formData, guruData, loading, onChange, onSubmit, onCancel }) {
  return (
    <div className="form-panel glass">
      <div className="panel-header border-b">
        <h2>{view === 'add' ? 'Tambah Mata Pelajaran' : 'Edit Mata Pelajaran'}</h2>
      </div>

      <form onSubmit={onSubmit} className="custom-form p-6 mt-4">
        <div className="input-group full">
          <label>
            Nama Mata Pelajaran <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_mapel"
            value={formData.nama_mapel}
            onChange={onChange}
            placeholder="Contoh: Matematika Wajib"
            required
            autoFocus
          />
        </div>
        <div className="input-group full mt-4">
          <label>
            Guru Pengampu <span className="text-red-500">*</span>
          </label>
          <select name="id_guru" value={formData.id_guru} onChange={onChange} required>
            <option value="">-- Pilih Guru --</option>
            {guruData.map((guru) => (
              <option key={guru.id_user} value={guru.id_user}>
                {guru.profile?.nama_guru} ({guru.username})
              </option>
            ))}
          </select>
        </div>

        <div className="form-footer mt-8">
          <button type="button" onClick={onCancel} className="btn-outline">
            <X size={18} /> {view === 'add' ? 'Batalkan' : 'Batal Edit'}
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Save size={18} /> {loading ? 'Menyimpan...' : view === 'add' ? 'Simpan Mata Pelajaran' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
