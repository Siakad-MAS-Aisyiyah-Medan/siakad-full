import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  Image,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Plus,
  Save,
  Underline,
  X,
} from 'lucide-react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import { Indonesian } from 'flatpickr/dist/l10n/id.js';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { apiConfig } from '@/config/api.config';
import { resolveStorageUrl } from '@app/shared/services/apiHelpers';

import PageHeader from '@app/shared/components/PageHeader';

export default function PengumumanForm({ view, formData, loading, onChange, onSubmit, onCancel, readOnly = false }) {
  return (
    <div className="admin-page-wrapper animate-fade-in">
      <PageHeader 
        title={readOnly ? 'Detail Pengumuman' : view === 'add' ? 'Tambah Pengumuman' : 'Edit Pengumuman'}
        subtitle={readOnly ? 'Informasi lengkap pengumuman sekolah' : view === 'add' ? 'Isi form untuk membuat pengumuman baru' : 'Perbarui informasi pengumuman'}
        onBack={onCancel}
      />

      <div className="form-panel">
        <form onSubmit={onSubmit}>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Judul */}
            <div>
              <FormLabel required>Judul Pengumuman</FormLabel>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={onChange}
                placeholder="Masukkan judul pengumuman"
                className="form-control"
                required
                disabled={readOnly}
              />
            </div>

            {/* Akses + Tanggal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <FormLabel required>Kategori / Akses</FormLabel>
                <select
                  name="akses"
                  value={formData.akses}
                  onChange={onChange}
                  className="form-control"
                  disabled={readOnly}
                >
                  <option value="umum">Umum</option>
                  <option value="internal">Internal</option>
                </select>
              </div>
              <div>
                <FormLabel required>Tanggal Publikasi</FormLabel>
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
                  className="form-control"
                  disabled={readOnly}
                  placeholder="Pilih tanggal..."
                  style={{ background: '#fff' }}
                />
              </div>
            </div>

            {/* Gambar Upload */}
            <div>
              <FormLabel>Gambar <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(Opsional)</span></FormLabel>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '130px', borderRadius: '12px',
                border: '2px dashed var(--color-border)',
                padding: '1.5rem', textAlign: 'center',
                cursor: readOnly ? 'not-allowed' : 'pointer',
                background: '#fafcff',
                transition: 'all 0.15s ease',
              }}
                onMouseEnter={e => !readOnly && (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              >
                {formData.thumbnail ? (
                  typeof formData.thumbnail === 'string' ? (
                    <img src={resolveStorageUrl(formData.thumbnail, apiConfig)} alt="Preview" style={{ maxHeight: '180px', objectFit: 'contain', borderRadius: '8px' }} />
                  ) : (
                    <img src={URL.createObjectURL(formData.thumbnail)} alt="Preview" style={{ maxHeight: '180px', objectFit: 'contain', borderRadius: '8px' }} />
                  )
                ) : (
                  <>
                    <Image size={28} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', opacity: 0.6 }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                      Klik untuk unggah gambar
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Format: JPG, PNG • Maks. 2MB</span>
                  </>
                )}
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={onChange}
                  style={{ display: 'none' }}
                  disabled={readOnly}
                />
              </label>
            </div>

            {/* Editor */}
            <div>
              <FormLabel required>Isi Pengumuman</FormLabel>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1.5px solid var(--color-border)' }}>
                {readOnly ? (
                  <div style={{ padding: '1rem', background: '#f8fafc' }} dangerouslySetInnerHTML={{ __html: formData.isi }} />
                ) : (
                  <ReactQuill
                    theme="snow"
                    value={formData.isi}
                    onChange={(val) => onChange({ target: { name: 'isi', value: val || '' } })}
                    placeholder="Tulis isi pengumuman di sini..."
                    readOnly={readOnly}
                    style={{ height: '300px', paddingBottom: '42px' }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {!readOnly && (
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--color-background)', borderRadius: '0 0 16px 16px' }}>
              <button type="button" onClick={onCancel} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <X size={16} />
                Batal
              </button>
              <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                {view === 'add' ? <Plus size={16} /> : <Save size={16} />}
                {loading ? 'Menyimpan...' : view === 'add' ? 'Tambahkan' : 'Simpan Perubahan'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function FormLabel({ children, required }) {
  return (
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '0.4rem' }}>
      {children} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
    </label>
  );
}
