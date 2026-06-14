import { Save, X, Image as ImageIcon, ShieldAlert, GraduationCap, MapPin, Phone, Mail, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function GuruForm({ view, formData, loading, onChange, onSubmit, onCancel }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (formData.foto && formData.foto instanceof File) {
      const url = URL.createObjectURL(formData.foto);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof formData.foto === 'string') {
      setPreviewUrl(formData.foto);
    } else {
      setPreviewUrl(null);
    }
  }, [formData.foto]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {view === 'add' ? 'Tambah Data Guru Baru' : 'Edit Data Guru'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Lengkapi profil, akun login, dan foto guru/tenaga pendidik.
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
          
          {/* KOLOM KIRI (FOTO & AKUN) */}
          <div className="space-y-6">
            {/* FOTO PROFIL */}
            <div>
              <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Foto Profil Guru
              </label>
              <label className="block w-full border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30 rounded-3xl p-6 text-center cursor-pointer transition-all group overflow-hidden relative" style={{ aspectRatio: '3/4' }}>
                <input
                  type="file"
                  name="foto"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={onChange}
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="absolute inset-0 w-full h-full p-2">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl shadow-sm" />
                    <div className="absolute inset-2 bg-slate-900/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-full">Ganti Foto</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                      <UserIcon size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-600 group-hover:text-blue-600">Unggah Foto Profil</p>
                      <p className="text-xs font-medium text-slate-400 mt-1">Rasio 3:4 (Max 2MB)</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* AKUN LOGIN */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <ShieldAlert size={16} className="text-blue-500" /> Akun Login
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Username <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={onChange}
                    placeholder="misal: guru_budiman"
                    className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-3.5 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={14} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      placeholder="budiman@sekolah.id"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl pl-9 pr-3.5 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password {view === 'edit' && <span className="text-slate-400 font-normal">(Kosongkan jika tak diubah)</span>}</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    placeholder="Minimal 8 karakter"
                    className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-3.5 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (PROFIL LENGKAP) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Informasi Pribadi</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Nama Lengkap & Gelar <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap size={18} />
                  </div>
                  <input
                    type="text"
                    name="nama_guru"
                    value={formData.nama_guru}
                    onChange={onChange}
                    placeholder="Contoh: Drs. Budiman Wijaya, M.Pd."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[15px] font-semibold rounded-xl pl-11 pr-4 h-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">NIP / NUPTK <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nip_nuptk"
                  value={formData.nip_nuptk}
                  onChange={onChange}
                  placeholder="Nomor identitas pegawai"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl px-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Nomor HP/WA <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={onChange}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl pl-10 pr-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Jenis Kelamin <span className="text-red-500">*</span></label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={onChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl px-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Agama <span className="text-red-500">*</span></label>
                <select
                  name="agama"
                  value={formData.agama}
                  onChange={onChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl px-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen Protestan</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Alamat Domisili <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
                    <MapPin size={16} />
                  </div>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={onChange}
                    rows="3"
                    placeholder="Alamat lengkap tempat tinggal"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 pt-4">Status Kepegawaian</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Peran Akun Sistem <span className="text-red-500">*</span></label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={onChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl px-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="guru">Guru Biasa / Mata Pelajaran</option>
                  <option value="wali_kelas">Guru & Wali Kelas</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Status Mengajar <span className="text-red-500">*</span></label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  className={`w-full bg-slate-50 border border-slate-200 text-[14px] font-bold rounded-xl px-4 h-11 focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer ${
                    formData.status === 'aktif' ? 'text-emerald-600 focus:border-emerald-500 focus:ring-emerald-500/10' : 'text-rose-600 focus:border-rose-500 focus:ring-rose-500/10'
                  }`}
                >
                  <option value="aktif">🟢 Aktif Mengajar</option>
                  <option value="nonaktif">🔴 Nonaktif / Cuti / Resign</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
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
            className="h-11 px-8 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} strokeWidth={2.5} />
            )}
            {loading ? 'Menyimpan...' : 'Simpan Data Guru'}
          </button>
        </div>
      </form>
    </div>
  );
}
