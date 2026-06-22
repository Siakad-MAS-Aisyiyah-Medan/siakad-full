import { ArrowLeft, Plus, Save, X } from 'lucide-react';
import { guruLabel } from '@/shared/utils/guruLabel';
import PageHeader from '@/shared/components/PageHeader';

export default function MapelForm({ view, formData, guruData, kelasData = [], loading, onChange, onSubmit, onCancel, readOnly = false }) {
  const isEdit = view === 'edit' && !readOnly;
  
  const selectableKelas = kelasData.filter(k => !formData.tingkat || k.tingkat === formData.tingkat);
  const selectedKelas = formData.id_kelas || [];

  const toggleKelas = (id_kelas) => {
    if (readOnly) return;
    const current = selectedKelas;
    const newValue = current.includes(id_kelas) 
      ? current.filter(id => id !== id_kelas)
      : [...current, id_kelas];
      
    onChange({ target: { name: 'id_kelas', value: newValue } });
  };

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
              <EditRow label="Tingkatan" last={!formData.tingkat}>
                <select name="tingkat" value={formData.tingkat || ''} onChange={(e) => { onChange(e); onChange({ target: { name: 'id_kelas', value: [] } }); }} className="form-control" required>
                  <option value="">Pilih tingkatan</option>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </EditRow>
              {formData.tingkat && (
                <EditRow label="Kelas yang Diajar" last>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', maxHeight: '200px', overflowY: 'auto' }}>
                    {selectableKelas.length === 0 ? (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Tidak ada kelas untuk tingkat ini</span>
                    ) : (
                      selectableKelas.map(k => (
                        <label key={k.id_kelas} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: readOnly ? 'default' : 'pointer' }}>
                          <input type="checkbox" checked={selectedKelas.includes(k.id_kelas)} onChange={() => toggleKelas(k.id_kelas)} disabled={readOnly} style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }} />
                          {k.nama_kelas}
                        </label>
                      ))
                    )}
                  </div>
                </EditRow>
              )}
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
                <select name="tingkat" value={formData.tingkat || ''} onChange={(e) => { onChange(e); onChange({ target: { name: 'id_kelas', value: [] } }); }} className="form-control" disabled={readOnly} required>
                  <option value="">Pilih tingkatan</option>
                  <option value="X">X</option>
                  <option value="XI">XI</option>
                  <option value="XII">XII</option>
                </select>
              </div>
              {formData.tingkat && (
                <div>
                  <FormLabel>Kelas yang Diajar</FormLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    {selectableKelas.length === 0 ? (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Tidak ada kelas untuk tingkat ini</span>
                    ) : (
                      selectableKelas.map(k => (
                        <label key={k.id_kelas} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: readOnly ? 'default' : 'pointer', background: '#fff', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <input type="checkbox" checked={selectedKelas.includes(k.id_kelas)} onChange={() => toggleKelas(k.id_kelas)} disabled={readOnly} style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }} />
                          {k.nama_kelas}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
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
