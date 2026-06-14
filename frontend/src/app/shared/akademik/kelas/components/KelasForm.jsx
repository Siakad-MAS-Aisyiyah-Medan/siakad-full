import { Save, X, Users, MapPin, GraduationCap, Building } from 'lucide-react';
import { guruLabel } from '@app/shared/utils/guruLabel';

export default function KelasForm({ view, formData, guruData, loading, onChange, onSubmit, onCancel }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {view === 'add' ? 'Tambah Kelas Baru' : 'Edit Data Kelas'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Lengkapi detail informasi untuk kelas ini.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-8">
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Nama Kelas <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <GraduationCap size={18} />
                </div>
                <input
                  type="text"
                  name="nama_kelas"
                  value={formData.nama_kelas}
                  onChange={onChange}
                  placeholder="Contoh: X IPA 1"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[15px] font-semibold rounded-xl pl-11 pr-4 h-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Tingkat <span className="text-red-500">*</span></label>
              <select
                name="tingkat"
                value={formData.tingkat}
                onChange={onChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl px-4 h-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Pilih Tingkat...</option>
                <option value="X">Kelas X</option>
                <option value="XI">Kelas XI</option>
                <option value="XII">Kelas XII</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Jurusan <span className="text-red-500">*</span></label>
              <select
                name="jurusan"
                value={formData.jurusan}
                onChange={onChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl px-4 h-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Pilih Jurusan...</option>
                <option value="IPA">IPA (MIPA)</option>
                <option value="IPS">IPS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Kapasitas Maksimal <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Users size={16} />
                </div>
                <input
                  type="number"
                  name="kapasitas_maksimal"
                  value={formData.kapasitas_maksimal}
                  onChange={onChange}
                  min="1"
                  max="100"
                  placeholder="36"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl pl-10 pr-4 h-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Ruangan (Opsional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin size={16} />
                </div>
                <input
                  type="text"
                  name="ruangan"
                  value={formData.ruangan}
                  onChange={onChange}
                  placeholder="Contoh: Gedung A Lt. 2 Ruang 101"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl pl-10 pr-4 h-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Wali Kelas (Opsional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building size={16} />
                </div>
                <select
                  name="id_wali_kelas"
                  value={formData.id_wali_kelas}
                  onChange={onChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl pl-10 pr-4 h-12 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Wali Kelas --</option>
                  {guruData.map((guru) => (
                    <option key={guru.id_user} value={guru.id_user}>
                      {guruLabel(guru)}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">Kosongkan jika kelas belum memiliki wali kelas definitif.</p>
            </div>
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
            className="h-11 px-8 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} strokeWidth={2.5} />
            )}
            {loading ? 'Menyimpan...' : 'Simpan Data Kelas'}
          </button>
        </div>
      </form>
    </div>
  );
}
