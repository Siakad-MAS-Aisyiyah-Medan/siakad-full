import { ArrowLeft, Plus, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchKelasList } from '@app/shared/akademik/kelas/services/kelas.service';

export default function MuridForm({ view, formData, loading, onChange, onSubmit, onCancel, readOnly = false }) {
  const [kelasList, setKelasList] = useState([]);
  const isEdit = view === 'edit' && !readOnly;

  useEffect(() => {
    fetchKelasList()
      .then((res) => setKelasList(Array.isArray(res) ? res : []))
      .catch(() => setKelasList([]));
  }, []);

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
            {readOnly ? 'Detail Data Murid' : view === 'add' ? 'Tambah Data Murid' : 'Edit Data Murid'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            {readOnly ? 'Informasi lengkap data murid' : view === 'add' ? 'Isi data untuk menambah murid baru' : 'Perbarui informasi data murid'}
          </p>
        </div>
      </div>

      <div className="form-panel">
        <form onSubmit={onSubmit}>
          {isEdit ? (
            <div>
              <EditRow label="Nama Murid">
                <input name="nama_siswa" value={formData.nama_siswa || ''} onChange={onChange} className="form-control" required />
              </EditRow>
              <EditRow label="NISN">
                <input name="nisn" value={formData.nisn || ''} onChange={onChange} className="form-control" required />
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
              <EditRow label="Tahun Masuk">
                <select name="tahun_masuk" value={formData.tahun_masuk || ''} onChange={onChange} className="form-control" required>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const year = 2021 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </EditRow>
              <EditRow label="Tahun Lulus">
                <select name="tahun_lulus" value={formData.tahun_lulus || ''} onChange={onChange} className="form-control">
                  <option value="">-</option>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const year = 2024 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </EditRow>
              <EditRow label="Status" last>
                <select
                  name="status_aktif"
                  value={formData.status_aktif !== undefined ? (formData.status_aktif ? '1' : '0') : '1'}
                  onChange={(e) => onChange({ target: { name: 'status_aktif', value: e.target.value === '1' } })}
                  className="form-control"
                >
                  <option value="1">Aktif</option>
                  <option value="0">Nonaktif</option>
                </select>
              </EditRow>
            </div>
          ) : (
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <FormLabel required>Nama Murid</FormLabel>
                <input name="nama_siswa" value={formData.nama_siswa || ''} onChange={onChange} className="form-control" placeholder="Masukkan nama murid" disabled={readOnly} required />
              </div>
              <div>
                <FormLabel required>NISN</FormLabel>
                <input name="nisn" value={formData.nisn || ''} onChange={onChange} className="form-control" placeholder="Masukkan NISN" disabled={readOnly} required />
              </div>

              <div>
                <FormLabel>Kelas</FormLabel>
                <select name="id_kelas" value={formData.id_kelas || ''} onChange={onChange} className="form-control" disabled={readOnly}>
                  <option value="">Pilih kelas</option>
                  {kelasList.map((kelas) => (
                    <option key={kelas.id_kelas} value={kelas.id_kelas}>{kelas.nama_kelas}</option>
                  ))}
                </select>
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
                <FormLabel required>Tempat Lahir</FormLabel>
                <input name="tempat_lahir" value={formData.tempat_lahir || ''} onChange={onChange} className="form-control" placeholder="Masukkan tempat lahir" disabled={readOnly} required />
              </div>
              <div>
                <FormLabel required>Tanggal Lahir</FormLabel>
                <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir || formData.tgl_lahir || ''} onChange={onChange} className="form-control" disabled={readOnly} required />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <FormLabel required>Alamat</FormLabel>
                <textarea name="alamat" value={formData.alamat || ''} onChange={onChange} rows={3} className="form-control" placeholder="Masukkan alamat lengkap" disabled={readOnly} required />
              </div>

              <div>
                <FormLabel required>No HP</FormLabel>
                <input name="no_hp" value={formData.no_hp || ''} onChange={onChange} className="form-control" placeholder="Masukkan nomor HP" disabled={readOnly} required />
              </div>
              <div />

              <div>
                <FormLabel required>Tahun Masuk</FormLabel>
                <select name="tahun_masuk" value={formData.tahun_masuk || ''} onChange={onChange} className="form-control" disabled={readOnly} required>
                  <option value="">Pilih tahun masuk</option>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const year = 2021 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
              <div>
                <FormLabel>Tahun Lulus</FormLabel>
                <select name="tahun_lulus" value={formData.tahun_lulus || ''} onChange={onChange} className="form-control" disabled={readOnly}>
                  <option value="">Pilih tahun lulus</option>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const year = 2024 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <FormLabel required>Status</FormLabel>
                <select
                  name="status_aktif"
                  value={formData.status_aktif !== undefined ? (formData.status_aktif ? '1' : '0') : '1'}
                  onChange={(e) => onChange({ target: { name: 'status_aktif', value: e.target.value === '1' } })}
                  className="form-control"
                  disabled={readOnly}
                >
                  <option value="1">Aktif</option>
                  <option value="0">Nonaktif</option>
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
