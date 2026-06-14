import { Save, X, ShieldAlert, GraduationCap, MapPin, Phone, Mail, Calendar, Hash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchKelasList } from '@app/shared/akademik/kelas/services/kelas.service';

export default function MuridForm({ view, formData, loading, onChange, onSubmit, onCancel }) {
  const [kelasList, setKelasList] = useState([]);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await fetchKelasList();
        if (res && res.length > 0) {
          setKelasList(res);
        }
      } catch (err) {
        console.error('Failed to fetch kelas', err);
      }
    };
    fetchKelas();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mt-6">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {view === 'add' ? 'Tambah Data Murid Baru' : 'Edit Data Murid'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Lengkapi profil, identitas, dan akun login murid.
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
          
          {/* KOLOM KIRI (AKUN) */}
          <div className="space-y-6">
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
                    value={formData.username || ''}
                    onChange={onChange}
                    placeholder="NISN atau format lain"
                    className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-3.5 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={14} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={onChange}
                      placeholder="Email murid (opsional)"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl pl-9 pr-3.5 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password {view === 'edit' && <span className="text-slate-400 font-normal">(Kosongkan jika tak diubah)</span>}</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ''}
                    onChange={onChange}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-3.5 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required={view === 'add'}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <GraduationCap size={16} className="text-blue-500" /> Penempatan & Akademik
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kelas</label>
                  <select
                    name="id_kelas"
                    value={formData.id_kelas || ''}
                    onChange={onChange}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-3.5 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                  >
                    <option value="">-- Pilih Kelas (Opsional) --</option>
                    {kelasList.map(k => (
                      <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tahun Masuk <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="tahun_masuk"
                      value={formData.tahun_masuk || new Date().getFullYear()}
                      onChange={onChange}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-3.5 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tahun Lulus</label>
                    <input
                      type="number"
                      name="tahun_lulus"
                      value={formData.tahun_lulus || ''}
                      onChange={onChange}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-3.5 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (PROFIL LENGKAP) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Identitas Siswa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Nama Lengkap Murid <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap size={18} />
                  </div>
                  <input
                    type="text"
                    name="nama_siswa"
                    value={formData.nama_siswa || ''}
                    onChange={onChange}
                    placeholder="Nama Lengkap"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[15px] font-semibold rounded-xl pl-11 pr-4 h-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">NISN</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash size={16} />
                  </div>
                  <input
                    type="text"
                    name="nisn"
                    value={formData.nisn || ''}
                    onChange={onChange}
                    placeholder="Nomor Induk Siswa Nasional"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl pl-10 pr-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">NIS (Lokal Sekolah)</label>
                <input
                  type="text"
                  name="nis"
                  value={formData.nis || ''}
                  onChange={onChange}
                  placeholder="Nomor Induk Sekolah"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl px-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Jenis Kelamin <span className="text-red-500">*</span></label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin || 'L'}
                  onChange={onChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl px-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Nomor HP/WA</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    name="no_hp"
                    value={formData.no_hp || ''}
                    onChange={onChange}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl pl-10 pr-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Tempat Lahir</label>
                <input
                  type="text"
                  name="tempat_lahir"
                  value={formData.tempat_lahir || ''}
                  onChange={onChange}
                  placeholder="Tempat kelahiran"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl px-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Tanggal Lahir</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={16} />
                  </div>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir || ''}
                    onChange={onChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl pl-10 pr-4 h-11 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Alamat Domisili</label>
                <div className="relative">
                  <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
                    <MapPin size={16} />
                  </div>
                  <textarea
                    name="alamat"
                    value={formData.alamat || ''}
                    onChange={onChange}
                    rows="3"
                    placeholder="Alamat lengkap tempat tinggal"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 pt-4">Status Siswa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Status Siswa <span className="text-red-500">*</span></label>
                <select
                  name="status_aktif"
                  value={formData.status_aktif !== undefined ? (formData.status_aktif ? '1' : '0') : '1'}
                  onChange={(e) => onChange({ target: { name: 'status_aktif', value: e.target.value === '1' } })}
                  className={`w-full bg-slate-50 border border-slate-200 text-[14px] font-bold rounded-xl px-4 h-11 focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer ${
                    (formData.status_aktif !== undefined ? formData.status_aktif : true) ? 'text-emerald-600 focus:border-emerald-500 focus:ring-emerald-500/10' : 'text-rose-600 focus:border-rose-500 focus:ring-rose-500/10'
                  }`}
                >
                  <option value="1">🟢 Aktif</option>
                  <option value="0">🔴 Nonaktif</option>
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
            className="h-11 px-8 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 hover:shadow-emerald-600/50 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} strokeWidth={2.5} />
            )}
            {loading ? 'Menyimpan...' : 'Simpan Data Murid'}
          </button>
        </div>
      </form>
    </div>
  );
}
