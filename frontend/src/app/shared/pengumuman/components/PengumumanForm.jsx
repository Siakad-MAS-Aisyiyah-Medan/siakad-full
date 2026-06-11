import { Save, X } from 'lucide-react';

export default function PengumumanForm({ view, formData, loading, onChange, onSubmit, onCancel }) {
  return (
    <div className="form-panel glass">
      <div className="panel-header border-b">
        <h2>{view === 'add' ? 'Tambah Pengumuman' : 'Edit Pengumuman'}</h2>
      </div>

      <form onSubmit={onSubmit} className="custom-form p-6 mt-4">
        <div className="input-group full">
          <label>
            Judul <span className="text-red-500">*</span>
          </label>
          <input type="text" name="judul" value={formData.judul} onChange={onChange} required autoFocus />
        </div>

        <div className="input-group full mt-4">
          <label>
            Isi Pengumuman <span className="text-red-500">*</span>
          </label>
          <textarea name="isi" value={formData.isi} onChange={onChange} rows={6} required />
        </div>

        <div className="input-group full mt-4">
          <label>Tanggal Publikasi</label>
          <input
            type="date"
            name="tanggal_publikasi"
            value={formData.tanggal_publikasi}
            onChange={onChange}
          />
        </div>

        <div className="input-group full mt-6">
          <label className="mb-3 block font-semibold text-slate-700">
            Hak Akses Pengumuman <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opsi Umum */}
            <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-1 transition-all ${
              formData.akses === 'umum' 
                ? 'border-emerald-500 bg-emerald-50/50' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold ${formData.akses === 'umum' ? 'text-emerald-700' : 'text-slate-700'}`}>Umum (Publik)</span>
                <input 
                  type="radio" 
                  name="akses" 
                  value="umum" 
                  checked={formData.akses === 'umum'} 
                  onChange={onChange} 
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              <p className="text-sm text-slate-500">Dapat dilihat oleh semua orang termasuk pengunjung website.</p>
            </label>

            {/* Opsi Internal */}
            <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-1 transition-all ${
              formData.akses === 'internal' 
                ? 'border-blue-500 bg-blue-50/50' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold ${formData.akses === 'internal' ? 'text-blue-700' : 'text-slate-700'}`}>Internal Sekolah</span>
                <input 
                  type="radio" 
                  name="akses" 
                  value="internal" 
                  checked={formData.akses === 'internal'} 
                  onChange={onChange} 
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <p className="text-sm text-slate-500">Hanya dapat dilihat oleh Admin, Kepsek, Guru, dan Murid.</p>
            </label>
          </div>
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
