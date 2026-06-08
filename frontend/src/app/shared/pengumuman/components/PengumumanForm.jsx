import { Save, X } from 'lucide-react';

export default function PengumumanForm({ view, formData, loading, onChange, onSubmit, onCancel }) {
  return (
    <div className="form-panel glass">
      <div className="panel-header border-b">
        <h2>{view === 'add' ? 'Tambah Pengumuman' : 'Edit Pengumuman'}</h2>
      </div>

      <form onSubmit={onSubmit} className="custom-form p-6 mt-4">
        <div className="input-group full">
          <label>
            Judul <span className="text-red-500">*</span>
          </label>
          <input type="text" name="judul" value={formData.judul} onChange={onChange} required autoFocus />
        </div>

        <div className="input-group full mt-4">
          <label>
            Isi Pengumuman <span className="text-red-500">*</span>
          </label>
          <textarea name="isi" value={formData.isi} onChange={onChange} rows={6} required />
        </div>

        <div className="input-group full mt-4">
          <label>Tanggal Publikasi</label>
          <input
            type="date"
            name="tanggal_publikasi"
            value={formData.tanggal_publikasi}
            onChange={onChange}
          />
        </div>

        <div className="input-group full mt-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_published" checked={formData.is_published} onChange={onChange} />
            Publikasikan ke landing page
          </label>
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
