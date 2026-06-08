import { Save, X } from 'lucide-react';
import { guruLabel } from '@app/shared/utils/guruLabel';

export default function EkskulForm({ view, formData, guruData, loading, onChange, onSubmit, onCancel }) {
  return (
    <div className="form-panel glass">
      <div className="panel-header border-b">
        <h2>{view === 'add' ? 'Tambah Ekstrakurikuler' : 'Edit Ekstrakurikuler'}</h2>
      </div>

      <form onSubmit={onSubmit} className="custom-form p-6 mt-4">
        <div className="input-group full">
          <label>
            Nama Ekskul <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_ekskul"
            value={formData.nama_ekskul}
            onChange={onChange}
            required
            autoFocus
          />
        </div>

        <div className="input-group full mt-4">
          <label>Deskripsi</label>
          <textarea name="deskripsi" value={formData.deskripsi} onChange={onChange} rows={4} />
        </div>

        <div className="input-group full mt-4">
          <label>Pembina</label>
          <select name="id_pembina" value={formData.id_pembina} onChange={onChange}>
            <option value="">-- Pilih Pembina --</option>
            {guruData.map((g) => (
              <option key={g.id_user} value={g.id_user}>
                {guruLabel(g)}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group full mt-4">
          <label>Hari</label>
          <input type="text" name="hari" value={formData.hari} onChange={onChange} placeholder="Senin" />
        </div>

        <div className="input-group full mt-4">
          <label>Jam</label>
          <input type="text" name="jam" value={formData.jam} onChange={onChange} placeholder="15:00 - 17:00" />
        </div>

        <div className="input-group full mt-4">
          <label>Lokasi</label>
          <input type="text" name="lokasi" value={formData.lokasi} onChange={onChange} placeholder="Lapangan" />
        </div>

        <div className="form-footer mt-8">
          <button type="button" onClick={onCancel} className="btn-outline">
            <X size={18} /> Batal
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
