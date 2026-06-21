import { ArrowLeft, Plus, Save, X } from 'lucide-react';
import { guruLabel } from '@/shared/utils/guruLabel';
import PageHeader from '@/shared/components/PageHeader';

export default function MapelForm({ view, formData, guruData, loading, onChange, onSubmit, onCancel, readOnly = false }) {
  const isEdit = view === 'edit' && !readOnly;

  return (
    <div className="admin-page-wrapper animate-fade-in">
      <PageHeader 
        title={readOnly ? 'Detail Mata Pelajaran' : view === 'add' ? 'Tambah Mata Pelajaran' : 'Edit Mata Pelajaran'}
        subtitle={readOnly ? 'Informasi lengkap mata pelajaran' : view === 'add' ? 'Isi data untuk menambah mata pelajaran baru' : 'Perbarui informasi mata pelajaran'}
        onBack={onCancel}
      />

      <div className="form-panel">
        <form onSubmit={onSubmit}>
          {isEdit ? (
            <div>
              <EditRow label="Nama Mata Pelajaran">
                <input name="nama_mapel" value={formData.nama_mapel || ''} onChange={onChange} className="form-control" required />
              </EditRow>
              <EditRow label="Guru Pengampu">
                <select name="id_guru" value={formData.id_guru || ''} onChange={onChange} className="form-control" required>
                  <option value="">Pilih guru mata pelajaran</option>
                  {guruData.map((guru) => (
                    <option key={guru.id_user} value={guru.id_user}>{guruLabel(guru)}</option>
                  ))}
                </select>
              </EditRow>
              <EditRow label="Tingkatan" last>
                <select name="tingkat" value={formData.tingkat || ''} onChange={onChange} className="form-control" required>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </EditRow>
            </div>
          ) : (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <FormLabel required>Nama Mata Pelajaran</FormLabel>
                <input name="nama_mapel" value={formData.nama_mapel || ''} onChange={onChange} className="form-control" placeholder="Masukkan nama mata pelajaran" disabled={readOnly} required />
              </div>
              <div>
                <FormLabel required>Guru Pengampu</FormLabel>
                <select name="id_guru" value={formData.id_guru || ''} onChange={onChange} className="form-control" disabled={readOnly} required>
                  <option value="">Pilih guru mata pelajaran</option>
                  {guruData.map((guru) => (
                    <option key={guru.id_user} value={guru.id_user}>{guruLabel(guru)}</option>
                  ))}
                </select>
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
      gridTemplateColumns: '200px 1fr',
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
