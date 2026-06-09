import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, UserPlus, User, AtSign, Mail, Shield, Lock, Eye, EyeOff, Info, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import { useAuditLogs } from '@app/shared/akademik/audit-logs/hooks/useAuditLogs';
import { fetchAdminAkunList, createAdminAkun } from '@app/shared/services/akun.service';

export default function HakAksesPage() {
  const { items, meta, loading, search, setSearch, action, setAction, reload } = useAuditLogs();
  
  const [akunData, setAkunData] = useState([]);
  const [stats, setStats] = useState({ total_akun: '-', role_aktif: '-' });
  const [isAkunLoading, setIsAkunLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'operator'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loadAkun = async () => {
    setIsAkunLoading(true);
    try {
      const data = await fetchAdminAkunList();
      if (data) {
        setAkunData(data.users || []);
        setStats({
          total_akun: data.total_akun,
          role_aktif: data.role_aktif,
        });
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setIsAkunLoading(false);
    }
  };

  useEffect(() => {
    loadAkun();
  }, []);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', username: '', email: '', password: '', confirmPassword: '', role: 'operator' });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire('Error', 'Konfirmasi password tidak cocok', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Send without confirmPassword
      const submitData = { ...formData };
      delete submitData.confirmPassword;

      await createAdminAkun(submitData);
      Swal.fire('Sukses', 'Akun baru berhasil ditambahkan', 'success');
      handleCloseModal();
      loadAkun();
    } catch (error) {
      console.error(error);
      Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan akun. Periksa data Anda.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminPageShell>
      {/* Real implementation of Akun List */}
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Akun & Hak Akses</h2>
            <p>Kelola role pengguna dan hak akses menu di sistem SIAKAD.</p>
          </div>
          <div className="header-actions">
            <button type="button" onClick={handleAdd} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Tambah Akun
            </button>
          </div>
        </div>

        <div className="stats-info-grid mt-6">
          <div className="stat-box glass border-blue">
            <div className="stat-content">
              <div className="stat-value">{isAkunLoading ? '...' : stats.total_akun}</div>
              <div className="stat-label">Total Akun</div>
            </div>
          </div>
          <div className="stat-box glass border-green">
            <div className="stat-content">
              <div className="stat-value">{isAkunLoading ? '...' : stats.role_aktif}</div>
              <div className="stat-label">Role Aktif</div>
            </div>
          </div>
        </div>

        <div className="table-container glass mt-6">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isAkunLoading ? (
                <tr>
                  <td colSpan="5" className="text-center p-6">Memuat data akun...</td>
                </tr>
              ) : akunData.length > 0 ? (
                akunData.map((akun, index) => (
                  <tr key={akun.id}>
                    <td>{index + 1}</td>
                    <td className="font-medium">{akun.username}</td>
                    <td>
                      <span className="badge badge-success" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)' }}>
                        {akun.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${akun.status === 'aktif' ? 'badge-success' : 'badge-pending'}`}>
                        {akun.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => Swal.fire('Info', 'Fitur edit akun sedang dalam pengembangan', 'info')}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-secondary">Belum ada data akun</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#0f172a]/40 backdrop-blur-md transition-all">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-100 flex flex-col max-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-start p-8 pb-6 border-b border-slate-100 bg-white">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-[22px] font-bold text-slate-900 font-inter">Tambah Akun Baru</h3>
                  <p className="text-[14px] text-slate-500 mt-0.5">Lengkapi informasi akun untuk memberikan akses ke sistem.</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto p-8">
              <form id="addAccountForm" onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Nama & Username */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[15px] font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        required 
                        className="w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all text-slate-700 text-sm placeholder-[#94A3B8]" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        placeholder="Mis: Budi Santoso" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[15px] font-semibold text-slate-700 mb-2">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <AtSign size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        required 
                        className="w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all text-slate-700 text-sm placeholder-[#94A3B8]" 
                        value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})} 
                        placeholder="Mis: budi.santoso" 
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email & Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[15px] font-semibold text-slate-700 mb-2">Email Pribadi</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type="email" 
                        required 
                        className="w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all text-slate-700 text-sm placeholder-[#94A3B8]" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        placeholder="budi@email.com" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[15px] font-semibold text-slate-700 mb-2">Role Pengguna</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Shield size={18} className="text-slate-400" />
                      </div>
                      <select 
                        className="w-full h-12 pl-12 pr-10 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all appearance-none text-slate-700 text-sm font-medium" 
                        value={formData.role} 
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="admin">Administrator</option>
                        <option value="operator">Operator</option>
                        <option value="kepsek">Kepala Sekolah</option>
                        <option value="guru">Guru</option>
                        <option value="wali_kelas">Wali Kelas</option>
                        <option value="siswa">Siswa</option>
                        <option value="calon_siswa">Calon Siswa</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[15px] font-semibold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required 
                        minLength="6" 
                        className="w-full h-12 pl-12 pr-12 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all text-slate-700 text-sm placeholder-[#94A3B8]" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        placeholder="Minimal 6 karakter" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {/* Password Strength pseudo-indicator */}
                    {formData.password.length > 0 && (
                      <div className="mt-2 flex gap-1 items-center">
                        <div className={`h-1.5 flex-1 rounded-full ${formData.password.length > 0 ? 'bg-orange-400' : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full ${formData.password.length >= 6 ? 'bg-amber-400' : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full ${formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[15px] font-semibold text-slate-700 mb-2">Konfirmasi Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        required 
                        className={`w-full h-12 pl-12 pr-12 bg-[#F8FAFC] border ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-400 focus:ring-red-500/10 focus:border-red-500' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-emerald-400 focus:ring-emerald-500/10 focus:border-emerald-500' : 'border-slate-200 focus:ring-emerald-500/10 focus:border-emerald-500'} rounded-xl focus:bg-white outline-none transition-all text-slate-700 text-sm placeholder-[#94A3B8]`}
                        value={formData.confirmPassword} 
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                        placeholder="Ulangi password" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Hint */}
                <div className="flex items-start gap-3 bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl mt-4">
                  <div className="mt-0.5">
                    <Info size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[12px] text-emerald-800 font-semibold">Informasi Keamanan</p>
                    <p className="text-[11px] text-emerald-600 mt-0.5">Password yang Anda masukkan akan dienkripsi secara otomatis oleh sistem. Pastikan untuk menggunakan kombinasi yang kuat.</p>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 items-center">
              <button 
                type="button" 
                onClick={handleCloseModal} 
                className="px-6 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-full font-semibold transition-all shadow-sm text-[14px]"
              >
                Batal
              </button>
              <button 
                type="submit" 
                form="addAccountForm"
                disabled={isSubmitting} 
                className="px-6 py-2.5 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] shadow-md shadow-emerald-500/25 rounded-full font-semibold transition-all flex items-center gap-2 text-[14px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Simpan Akun
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </AdminPageShell>
  );
}
