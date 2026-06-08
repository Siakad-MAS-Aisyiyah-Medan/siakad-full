import { Save, X } from 'lucide-react';

export default function GuruForm({ view, formData, loading, onChange, onSubmit, onCancel }) {
  return (
    <div className="form-panel glass">
      <div className="panel-header border-b">
        <h2>{view === 'add' ? 'Registrasi Guru Baru' : 'Edit Data Guru'}</h2>
      </div>

      <form onSubmit={onSubmit} className="custom-form p-6 mt-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="input-group">
            <label>
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama_guru"
              value={formData.nama_guru}
              onChange={onChange}
              required
              autoFocus
            />
          </div>
          <div className="input-group">
            <label>
              NIP / NUPTK <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nip_nuptk"
              value={formData.nip_nuptk}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-group">
            <label>
              Jabatan <span className="text-red-500">*</span>
            </label>
            <select name="role" value={formData.role} onChange={onChange} required>
              <option value="guru">Guru Mata Pelajaran</option>
              <option value="wali_kelas">Wali Kelas</option>
            </select>
          </div>
          <div className="input-group">
            <label>
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={onChange} required>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div className="input-group">
            <label>
              Agama <span className="text-red-500">*</span>
            </label>
            <input type="text" name="agama" value={formData.agama} onChange={onChange} required />
          </div>
          <div className="input-group">
            <label>
              No. HP <span className="text-red-500">*</span>
            </label>
            <input type="text" name="no_hp" value={formData.no_hp} onChange={onChange} required />
          </div>
          <div className="input-group">
            <label>
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-group">
            <label>
              Alamat Email <span className="text-red-500">*</span>
            </label>
            <input type="email" name="email" value={formData.email} onChange={onChange} required />
          </div>
          <div className="input-group full">
            <label>
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea name="alamat" value={formData.alamat} onChange={onChange} required rows={2} />
          </div>
          <div className="input-group full">
            <label>
              Password Akun{' '}
              {view === 'edit' && (
                <span className="text-secondary font-normal">(Kosongkan jika tidak ingin diubah)</span>
              )}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Minimal 8 karakter"
              required={view === 'add'}
              minLength={view === 'add' ? 8 : undefined}
            />
          </div>
        </div>

        <div className="form-footer mt-8">
          <button type="button" onClick={onCancel} className="btn-outline">
            <X size={18} /> {view === 'add' ? 'Batalkan' : 'Batal Edit'}
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Save size={18} /> {loading ? 'Menyimpan...' : view === 'add' ? 'Simpan' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
