import { ArrowLeft, Plus, Save, X } from 'lucide-react';

export default function GuruForm({ view, formData, loading, onChange, onSubmit, onCancel, readOnly = false }) {
  const isEdit = view === 'edit' && !readOnly;

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
            {readOnly ? 'Detail Data Guru' : view === 'add' ? 'Tambah Data Guru' : 'Edit Data Guru'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            {readOnly ? 'Informasi lengkap data guru' : view === 'add' ? 'Isi data untuk menambah guru baru' : 'Perbarui informasi data guru'}
          </p>
        </div>
      </div>

      <div className="form-panel">
        <form onSubmit={onSubmit}>
          {isEdit ? (
            <div>
              <EditRow label="Nama Guru">
                <input name="nama_guru" value={formData.nama_guru || ''} onChange={onChange} className="form-control" required />
              </EditRow>
              <EditRow label="NIP/NUPTK">
                <input name="nip_nuptk" value={formData.nip_nuptk || ''} onChange={onChange} className="form-control" required />
              </EditRow>
              <EditRow label="Jenis Kelamin">
                <select name="jenis_kelamin" value={formData.jenis_kelamin || ''} onChange={onChange} className="form-control" required>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </EditRow>
              <EditRow label="No HP">
                <input name="no_hp" value={formData.no_hp || ''} onChange={onChange} className="form-control" required />
              </EditRow>
              <EditRow label="Alamat">
                <textarea name="alamat" value={formData.alamat || ''} onChange={onChange} className="form-control" rows={3} required />
              </EditRow>
              <EditRow label="Status" last>
                <select name="status" value={formData.status || ''} onChange={onChange} className="form-control" required>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </EditRow>
            </div>
          ) : (
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <FormLabel required>Nama Guru</FormLabel>
                <input name="nama_guru" value={formData.nama_guru || ''} onChange={onChange} className="form-control" placeholder="Masukkan nama guru" disabled={readOnly} required />
              </div>

              <div>
                <FormLabel required>NIP/NUPTK</FormLabel>
                <input name="nip_nuptk" value={formData.nip_nuptk || ''} onChange={onChange} className="form-control" placeholder="Masukkan NIP/NUPTK" disabled={readOnly} required />
              </div>
              <div>
                <FormLabel required>Jenis Kelamin</FormLabel>
                <select name="jenis_kelamin" value={formData.jenis_kelamin || ''} onChange={onChange} className="form-control" disabled={readOnly} required>
                  <option value="">Pilih jenis kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <FormLabel required>No HP</FormLabel>
                <input name="no_hp" value={formData.no_hp || ''} onChange={onChange} className="form-control" placeholder="Masukkan nomor HP" disabled={readOnly} required />
              </div>
              <div>
                <FormLabel required>Alamat</FormLabel>
                <textarea name="alamat" value={formData.alamat || ''} onChange={onChange} rows={3} className="form-control" placeholder="Masukkan alamat lengkap" disabled={readOnly} required />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <FormLabel required>Status</FormLabel>
                <select name="status" value={formData.status || ''} onChange={onChange} className="form-control" disabled={readOnly} required>
                  <option value="">Pilih status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>
          )}

          {!readOnly && (
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--color-background)', borderRadius: '0 0 16px 16px' }}>
              <button type="button" onClick={onCancel} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <X size={16} /> Batal
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

function EditRow({ label, children, last = false }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '160px 1fr',
      alignItems: 'center',
      gap: '1.25rem',
      padding: '0.9rem 1.5rem',
      borderBottom: last ? 'none' : '1px solid var(--color-border)',
    }}>
      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>{label}</label>
      {children}
    </div>
  );
}
