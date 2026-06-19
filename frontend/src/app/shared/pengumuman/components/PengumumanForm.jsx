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
import { createElement } from 'react';

const editorTools = [
  { icon: Bold, label: 'Tebal' },
  { icon: Italic, label: 'Miring' },
  { icon: Underline, label: 'Garis bawah' },
  { icon: List, label: 'Daftar' },
  { icon: ListOrdered, label: 'Daftar bernomor' },
  { icon: AlignLeft, label: 'Rata kiri' },
  { icon: AlignCenter, label: 'Rata tengah' },
  { icon: AlignRight, label: 'Rata kanan' },
  { icon: Link2, label: 'Tautan' },
  { icon: Image, label: 'Gambar' },
  { icon: Minus, label: 'Garis' },
];

export default function PengumumanForm({ view, formData, loading, onChange, onSubmit, onCancel, readOnly = false }) {
  return (
    <div className="admin-page-wrapper animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px',
            borderRadius: '10px', border: '1px solid var(--color-border)',
            background: '#fff', color: 'var(--color-text-dark)', cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>
            {readOnly ? 'Detail Pengumuman' : view === 'add' ? 'Tambah Pengumuman' : 'Edit Pengumuman'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            {readOnly ? 'Informasi lengkap pengumuman' : view === 'add' ? 'Buat pengumuman baru untuk civitas sekolah' : 'Perbarui informasi pengumuman'}
          </p>
        </div>
      </div>

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
                <input
                  type="datetime-local"
                  name="tanggal_publikasi"
                  value={formData.tanggal_publikasi}
                  onChange={onChange}
                  className="form-control"
                  disabled={readOnly}
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
                <Image size={28} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', opacity: 0.6 }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                  {formData.thumbnail?.name || 'Klik untuk unggah gambar'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Format: JPG, PNG • Maks. 2MB</span>
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
              <div style={{ border: '1.5px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
                {/* Toolbar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', background: '#f8fafc', padding: '0.35rem' }}>
                  <button type="button" disabled={readOnly} style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.8rem', border: 'none', background: 'none', color: 'var(--color-text-dark)', cursor: readOnly ? 'not-allowed' : 'pointer', borderRadius: '6px' }}>
                    Normal
                  </button>
                  {editorTools.map((tool) => (
                    <button
                      key={tool.label}
                      type="button"
                      title={tool.label}
                      disabled={readOnly}
                      style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', color: 'var(--color-text-muted)', cursor: readOnly ? 'not-allowed' : 'pointer', borderRadius: '6px', transition: 'all 0.15s' }}
                      onMouseEnter={e => !readOnly && (e.currentTarget.style.background = 'var(--color-primary-soft)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      {createElement(tool.icon, { size: 15 })}
                    </button>
                  ))}
                </div>
                <textarea
                  name="isi"
                  value={formData.isi}
                  onChange={onChange}
                  placeholder="Tulis isi pengumuman di sini..."
                  rows={8}
                  style={{ width: '100%', border: 'none', padding: '1rem', fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--color-text-dark)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  required
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--color-background)', borderRadius: '0 0 16px 16px' }}>
            <button type="button" onClick={onCancel} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <X size={16} />
              {readOnly ? 'Tutup' : 'Batal'}
            </button>
            {!readOnly && (
              <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                {view === 'add' ? <Plus size={16} /> : <Save size={16} />}
                {loading ? 'Menyimpan...' : view === 'add' ? 'Tambahkan' : 'Simpan Perubahan'}
              </button>
            )}
          </div>
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
