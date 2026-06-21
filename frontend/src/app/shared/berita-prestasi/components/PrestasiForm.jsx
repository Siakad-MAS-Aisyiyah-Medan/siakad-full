import { Save, X } from 'lucide-react';
import PageHeader from '@app/shared/components/PageHeader';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import { Indonesian } from 'flatpickr/dist/l10n/id.js';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
            {readOnly ? (
              <div style={{ padding: '1rem', background: '#f8fafc' }} dangerouslySetInnerHTML={{ __html: formData.isi }} />
            ) : (
              <ReactQuill
                theme="snow"
                value={formData.isi}
                onChange={(val) => onChange({ target: { name: 'isi', value: val || '' } })}
                readOnly={readOnly}
                style={{ height: '300px', paddingBottom: '42px' }}
              />
            )}
          </div>
        </div>

        <div className="input-group full mt-4">
          <label>URL Gambar (opsional)</label>
          {formData.gambar && (
            <div className="mb-3">
              <img src={formData.gambar} alt="Preview" style={{ maxHeight: '180px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          )}
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
          <Flatpickr
            value={formData.tanggal_publikasi}
            onChange={(selectedDates, dateStr) => {
              onChange({ target: { name: 'tanggal_publikasi', value: dateStr } });
            }}
            options={{
              locale: Indonesian,
              dateFormat: 'Y-m-d',
              altInput: true,
              altFormat: 'j F Y',
            }}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={readOnly}
            placeholder="Pilih tanggal..."
            style={{ background: '#fff' }}
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
