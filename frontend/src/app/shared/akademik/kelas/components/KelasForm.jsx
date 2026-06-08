import { Save, X } from 'lucide-react';
import { guruLabel } from '@app/shared/utils/guruLabel';

export default function KelasForm({ view, formData, guruData, loading, onChange, onSubmit, onCancel }) {
  return (
    <div className="form-panel glass">
      <div className="panel-header border-b">
        <h2>{view === 'add' ? 'Tambah Kelas Baru' : 'Edit Data Kelas'}</h2>
      </div>

      <form onSubmit={onSubmit} className="custom-form p-6 mt-4">
        <div className="input-group full">
          <label htmlFor="nama_kelas">
            Nama Kelas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nama_kelas"
            name="nama_kelas"
            value={formData.nama_kelas}
            onChange={onChange}
            placeholder="Contoh: X-IPA 1"
            required
            autoFocus
          />
        </div>

        <div className="input-group full">
          <label htmlFor="id_wali_kelas">Wali Kelas (Opsional)</label>
          <select id="id_wali_kelas" name="id_wali_kelas" value={formData.id_wali_kelas} onChange={onChange}>
            <option value="">-- Pilih Wali Kelas --</option>
            {guruData.map((guru) => (
              <option key={guru.id_user} value={guru.id_user}>
                {guruLabel(guru)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-footer mt-8">
          <button type="button" onClick={onCancel} className="btn-outline">
            <X size={18} /> {view === 'add' ? 'Batalkan' : 'Batal Edit'}
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Save size={18} /> {loading ? 'Menyimpan...' : view === 'add' ? 'Tambahkan Data' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
