import { ArrowLeft, Plus, Save, X } from 'lucide-react';
import { guruLabel } from '@app/shared/utils/guruLabel';

export default function KelasForm({ view, formData, guruData, loading, onChange, onSubmit, onCancel, readOnly = false }) {
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
            {readOnly ? 'Detail Data Kelas' : view === 'add' ? 'Tambah Data Kelas' : 'Edit Data Kelas'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            {readOnly ? 'Informasi lengkap data kelas' : view === 'add' ? 'Isi data untuk menambah kelas baru' : 'Perbarui informasi data kelas'}
          </p>
        </div>
      </div>

      <div className="form-panel">
        <form onSubmit={onSubmit}>
          {isEdit ? (
            <div>
              <EditRow label="Tahun Ajaran">
                <select name="tahun_ajaran" value={formData.tahun_ajaran || ''} onChange={onChange} className="form-control" required>
                  <option value="">Pilih tahun ajaran</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                </select>
              </EditRow>
              <EditRow label="Nama Kelas">
                <input name="nama_kelas" value={formData.nama_kelas || ''} onChange={onChange} className="form-control" required />
              </EditRow>
              <EditRow label="Tingkatan">
                <select name="tingkat" value={formData.tingkat || ''} onChange={onChange} className="form-control" required>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </EditRow>
              <EditRow label="Jurusan">
                <select name="jurusan" value={formData.jurusan || ''} onChange={onChange} className="form-control" required>
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                </select>
              </EditRow>
              <EditRow label="Wali Kelas">
                <select name="id_wali_kelas" value={formData.id_wali_kelas || ''} onChange={onChange} className="form-control">
                  <option value="">Pilih wali kelas</option>
                  {guruData.map((guru) => (
                    <option key={guru.id_user} value={guru.id_user}>{guruLabel(guru)}</option>
                  ))}
                </select>
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
              <div>
                <FormLabel required>Tahun Ajaran</FormLabel>
                <select name="tahun_ajaran" value={formData.tahun_ajaran || ''} onChange={onChange} className="form-control" disabled={readOnly} required>
                  <option value="">Pilih tahun ajaran</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                </select>
              </div>
              <div>
                <FormLabel required>Nama Kelas</FormLabel>
                <input name="nama_kelas" value={formData.nama_kelas || ''} onChange={onChange} className="form-control" placeholder="Masukkan nama kelas" disabled={readOnly} required />
              </div>

              <div>
                <FormLabel required>Tingkatan</FormLabel>
                <select name="tingkat" value={formData.tingkat || ''} onChange={onChange} className="form-control" disabled={readOnly} required>
                  <option value="">Pilih tingkatan</option>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </div>
              <div>
                <FormLabel required>Jurusan</FormLabel>
                <select name="jurusan" value={formData.jurusan || ''} onChange={onChange} className="form-control" disabled={readOnly} required>
                  <option value="">Pilih jurusan</option>
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                </select>
              </div>

              <div>
                <FormLabel>Wali Kelas</FormLabel>
                <select name="id_wali_kelas" value={formData.id_wali_kelas || ''} onChange={onChange} className="form-control" disabled={readOnly}>
                  <option value="">Pilih wali kelas</option>
                  {guruData.map((guru) => (
                    <option key={guru.id_user} value={guru.id_user}>{guruLabel(guru)}</option>
                  ))}
                </select>
              </div>
              <div>
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
