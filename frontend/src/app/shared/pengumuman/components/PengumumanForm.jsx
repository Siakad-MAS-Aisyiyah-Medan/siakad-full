import { Save, X, Image as ImageIcon, Tag, Lock, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PengumumanForm({ view, formData, loading, onChange, onSubmit, onCancel }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (formData.thumbnail && formData.thumbnail instanceof File) {
      const url = URL.createObjectURL(formData.thumbnail);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof formData.thumbnail === 'string') {
      setPreviewUrl(formData.thumbnail); // For previewing old thumbnail, but formData.thumbnail is null on edit to prevent string upload
    } else {
      setPreviewUrl(null);
    }
  }, [formData.thumbnail]);

  const KATEGORI_OPTIONS = [
    'Akademik',
    'Agenda Khusus',
    'Ekstrakurikuler',
    'Info PPDB',
    'Darurat / Penting',
    'Umum',
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {view === 'add' ? 'Buat Pengumuman Baru' : 'Edit Pengumuman'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Isi detail pengumuman yang akan dipublikasikan.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KOLOM KIRI (UTAMA) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Judul Pengumuman <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={onChange}
                placeholder="Contoh: Jadwal Ujian Tengah Semester Genap..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[15px] font-medium rounded-xl px-4 h-12 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Isi Pengumuman <span className="text-red-500">*</span>
              </label>
              <textarea
                name="isi"
                value={formData.isi}
                onChange={onChange}
                placeholder="Tuliskan isi pengumuman secara detail di sini..."
                rows={8}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[15px] font-medium rounded-xl p-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 resize-none"
                required
              />
            </div>
          </div>

          {/* KOLOM KANAN (PENGATURAN) */}
          <div className="space-y-6">
            {/* THUMBNAIL */}
            <div>
              <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Thumbnail / Gambar Sampul
              </label>
              <label className="block w-full border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all group overflow-hidden relative">
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  onChange={onChange}
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-full">Ganti Gambar</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-600 group-hover:text-emerald-600">Pilih Gambar</p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">PNG, JPG (Max. 2MB)</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* KATEGORI */}
            <div>
              <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kategori Tagline
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Tag size={16} />
                </div>
                <select
                  name="kategori"
                  value={formData.kategori || ''}
                  onChange={onChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-semibold rounded-xl pl-11 pr-4 h-12 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Pilih Kategori...</option>
                  {KATEGORI_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* TANGGAL PUBLIKASI */}
            <div>
              <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tanggal Publikasi
              </label>
              <input
                type="date"
                name="tanggal_publikasi"
                value={formData.tanggal_publikasi}
                onChange={onChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-semibold rounded-xl px-4 h-12 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* HAK AKSES */}
        <div className="mt-8 pt-8 border-t border-slate-100">
          <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-4">
            Hak Akses Pengumuman <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opsi Umum */}
            <label
              className={`cursor-pointer border-2 rounded-2xl p-5 flex items-start gap-4 transition-all ${
                formData.akses === 'umum'
                  ? 'border-emerald-500 bg-emerald-50/30 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`mt-0.5 flex shrink-0 items-center justify-center w-5 h-5 rounded-full border-2 ${
                formData.akses === 'umum' ? 'border-emerald-500' : 'border-slate-300'
              }`}>
                {formData.akses === 'umum' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users size={16} className={formData.akses === 'umum' ? 'text-emerald-600' : 'text-slate-500'} />
                  <span className={`font-bold text-[15px] ${formData.akses === 'umum' ? 'text-emerald-700' : 'text-slate-700'}`}>
                    Umum (Publik)
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Dapat dilihat oleh semua pengunjung website sekolah.
                </p>
              </div>
              <input
                type="radio"
                name="akses"
                value="umum"
                checked={formData.akses === 'umum'}
                onChange={onChange}
                className="hidden"
              />
            </label>

            {/* Opsi Internal */}
            <label
              className={`cursor-pointer border-2 rounded-2xl p-5 flex items-start gap-4 transition-all ${
                formData.akses === 'internal'
                  ? 'border-blue-500 bg-blue-50/30 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`mt-0.5 flex shrink-0 items-center justify-center w-5 h-5 rounded-full border-2 ${
                formData.akses === 'internal' ? 'border-blue-500' : 'border-slate-300'
              }`}>
                {formData.akses === 'internal' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={16} className={formData.akses === 'internal' ? 'text-blue-600' : 'text-slate-500'} />
                  <span className={`font-bold text-[15px] ${formData.akses === 'internal' ? 'text-blue-700' : 'text-slate-700'}`}>
                    Internal Sekolah
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Hanya untuk yang sudah masuk (Admin, Kepsek, Guru, Murid).
                </p>
              </div>
              <input
                type="radio"
                name="akses"
                value="internal"
                checked={formData.akses === 'internal'}
                onChange={onChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 px-6 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-11 px-8 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} strokeWidth={2.5} />
            )}
            {loading ? 'Menyimpan...' : 'Simpan & Publikasikan'}
          </button>
        </div>
      </form>
    </div>
  );
}
