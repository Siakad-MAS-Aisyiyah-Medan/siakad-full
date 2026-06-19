import { Save, X } from 'lucide-react';
import PageHeader from '@app/shared/components/PageHeader';

export default function PrestasiForm({ view, formData, loading, onChange, onSubmit, onCancel, readOnly = false }) {
  const title = readOnly ? 'Detail Artikel' : (view === 'add' ? 'Tambah Artikel' : 'Edit Artikel');
  return (
    <div className="form-panel glass" style={{ paddingTop: '1rem' }}>
      <PageHeader title={title} subtitle="Kelola data artikel berita dan prestasi" />

      <form onSubmit={onSubmit} className="custom-form p-6 mt-4">
        <div className="input-group full">
          <label>
            Judul <span className="text-red-500">*</span>
          </label>
          <input type="text" name="judul" value={formData.judul} onChange={onChange} required autoFocus={!readOnly} disabled={readOnly} />
        </div>

        <div className="input-group full mt-4">
          <label>
            Kategori <span className="text-red-500">*</span>
          </label>
          <select name="kategori" value={formData.kategori} onChange={onChange} required disabled={readOnly}>
            <option value="Berita">Berita</option>
            <option value="Prestasi">Prestasi</option>
          </select>
        </div>

        <div className="input-group full mt-4">
          <label>
            Isi Artikel <span className="text-red-500">*</span>
          </label>
          <textarea name="isi" value={formData.isi} onChange={onChange} rows={6} required disabled={readOnly} />
        </div>

        <div className="input-group full mt-4">
          <label>URL Gambar (opsional)</label>
          <input
            type="url"
            name="gambar"
            value={formData.gambar}
            onChange={onChange}
            placeholder="https://..."
            disabled={readOnly}
          />
        </div>

        <div className="input-group full mt-4">
          <label>Tanggal Publikasi</label>
          <input
            type="date"
            name="tanggal_publikasi"
            value={formData.tanggal_publikasi}
            onChange={onChange}
            disabled={readOnly}
          />
        </div>

        <div className="input-group full mt-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_published" checked={formData.is_published} onChange={onChange} disabled={readOnly} />
            Publikasikan ke landing page
          </label>
        </div>

        <div className="form-footer mt-8">
          <button type="button" onClick={onCancel} className="btn-outline">
            <X size={18} /> {readOnly ? 'Tutup' : 'Batal'}
          </button>
          {!readOnly && (
            <button type="submit" className="btn-primary" disabled={loading}>
              <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
