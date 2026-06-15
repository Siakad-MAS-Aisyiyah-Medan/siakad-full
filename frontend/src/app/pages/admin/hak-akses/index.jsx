import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, UserPlus, User, AtSign, Mail, Shield, Lock, Eye, EyeOff, Info, Check, Search, Filter, Trash2, Edit2, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import FormInput from '@app/shared/components/FormInput';
import { fetchAdminAkunList, createAdminAkun, deleteAdminAkun } from '@app/shared/services/akun.service';

export default function HakAksesPage() {
  const [akunData, setAkunData] = useState([]);
  const [stats, setStats] = useState({ total_akun: '-', role_aktif: '-' });
  const [isAkunLoading, setIsAkunLoading] = useState(true);
  
  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ last_page: 1, total: 0 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loadAkun = async (page = currentPage, search = searchQuery, role = roleFilter, status = statusFilter) => {
    setIsAkunLoading(true);
    try {
      const data = await fetchAdminAkunList({ page, search, role, status });
      console.log('API Response data:', data);
      if (data) {
        const usersArray = Array.isArray(data.users) ? data.users : (data.users ? Object.values(data.users) : []);
        setAkunData(usersArray);
        setStats({
          total_akun: data.total_akun,
          role_aktif: data.role_aktif,
        });
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setIsAkunLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadAkun(currentPage, searchQuery, roleFilter, statusFilter), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter, statusFilter, currentPage]);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Hapus Akun?',
      text: `Anda yakin ingin menghapus akun ${name}? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteAdminAkun(id);
        Swal.fire('Terhapus!', 'Data berhasil dihapus', 'success');
        loadAkun();
      } catch (error) {
        Swal.fire('Gagal', error.message || 'Gagal menghapus akun', 'error');
      }
    }
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' });
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

      // Auto-generate username from email since backend requires it
      const baseUsername = formData.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      submitData.username = `${baseUsername}${randomSuffix}`;

      await createAdminAkun(submitData);
      Swal.fire('Sukses', 'Data berhasil disimpan', 'success');
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
            <h2>Manajemen Pengguna</h2>
            <p>Kelola peran pengguna dan akun di sistem SIAKAD.</p>
          </div>
          <div className="header-actions">
            <button type="button" onClick={handleAdd} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Tambah Akun
            </button>
          </div>
        </div>

        <div className="stats-info-grid mt-6">
          <div className="stat-box glass border-blue flex gap-4 items-center p-5 safe-p-5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={24} strokeWidth={2} />
            </div>
            <div className="stat-content">
              <div className="stat-value text-2xl font-bold">{isAkunLoading ? '...' : stats.total_akun}</div>
              <div className="stat-label text-sm text-slate-500">Total Akun</div>
            </div>
          </div>
          <div className="stat-box glass border-green flex gap-4 items-center p-5 safe-p-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Shield size={24} strokeWidth={2} />
            </div>
            <div className="stat-content">
              <div className="stat-value text-2xl font-bold">{isAkunLoading ? '...' : stats.role_aktif}</div>
              <div className="stat-label text-sm text-slate-500">Role Aktif</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass mt-6 p-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-white rounded-2xl border border-slate-200">
          <div className="search-box w-full md:w-auto md:min-w-[300px]">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari username, email, NIP/NISN..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-transparent border-none outline-none text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative min-w-[170px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Filter size={16} className="text-slate-400" />
              </div>
              <select 
                value={roleFilter} 
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
              >
                <option value="">Semua Role</option>
                <option value="admin">Administrator</option>
                <option value="kepsek">Kepala Sekolah</option>
                <option value="guru">Guru</option>
                <option value="siswa">Siswa</option>
                <option value="calon_siswa">Calon Siswa</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            <div className="relative min-w-[170px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Filter size={16} className="text-slate-400" />
              </div>
              <select 
                value={statusFilter} 
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-medium rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
              >
                <option value="">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="table-container glass mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <table className="data-table w-full text-left border-collapse kelas-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100 rounded-tl-xl w-[20%]">
                      NIP/NISN
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100 w-[25%]">
                      Email
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100 w-[20%]">
                      Role
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100 w-[20%]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100 text-right rounded-tr-xl w-[15%]">
                      Aksi
                    </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {isAkunLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2 w-full">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-center">Memuat data akun...</span>
                    </div>
                  </td>
                </tr>
              ) : akunData.length > 0 ? (
                akunData.map((akun) => (
                  <tr key={akun.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-600">{akun.nip_nisn || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{akun.email}</td>
                    <td className="px-6 py-4">
                      <span className="badge badge-success" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)' }}>
                        {akun.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${akun.status === 'aktif' ? 'badge-success' : 'badge-pending'}`}>
                        {akun.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => Swal.fire('Info', 'Fitur edit akun sedang dalam pengembangan', 'info')} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDelete(akun.id, akun.name)} title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-slate-500 text-sm">Tidak ada data akun yang ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Total {pagination.total} akun
              </span>
              <div className="flex gap-1">
                {[...Array(pagination.last_page)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-custom-0f172a-40 backdrop-blur-md transition-all">
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
              <form id="addAccountForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Row 1: Nama Lengkap */}
                <div className="grid grid-cols-1 gap-6">
                  <FormInput 
                    label="Nama Lengkap"
                    icon={User}
                    placeholder="Mis: Budi Santoso"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                {/* Row 2: Email & Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    label="Email Pribadi"
                    type="email"
                    icon={Mail}
                    placeholder="budi@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                  <FormInput 
                    label="Role Pengguna"
                    type="select"
                    icon={Shield}
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    options={[
                      { value: 'admin', label: 'Administrator' },
                      { value: 'kepsek', label: 'Kepala Sekolah' },
                      { value: 'guru', label: 'Guru' },
                      { value: 'siswa', label: 'Siswa' },
                      { value: 'calon_siswa', label: 'Calon Siswa' }
                    ]}
                  />
                </div>

                {/* Row 3: Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormInput 
                      label="Password"
                      type="password"
                      icon={Lock}
                      placeholder="Minimal 6 karakter"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      minLength="6"
                    />
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
                    <FormInput 
                      label="Konfirmasi Password"
                      type="password"
                      icon={Lock}
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                      inputState={
                        formData.confirmPassword 
                          ? (formData.password === formData.confirmPassword ? 'success' : 'error') 
                          : 'default'
                      }
                    />
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
            <div className="flex justify-end items-center gap-[12px] px-[40px] py-[20px] bg-custom-F8FAFC border-t border-custom-E5E7EB">
              <button 
                type="button" 
                onClick={handleCloseModal} 
                className="flex items-center justify-center h-[44px] min-w-[96px] px-[18px] rounded-xl bg-custom-FFFFFF border border-custom-CBD5E1 text-custom-334155 font-semibold hover-bg-F1F5F9 hover-border-94A3B8 transition-all text-[14px]"
              >
                Batal
              </button>
              <button 
                type="submit" 
                form="addAccountForm"
                disabled={isSubmitting} 
                className="flex items-center justify-center gap-[8px] h-[44px] min-w-[150px] px-[20px] rounded-xl bg-custom-059669 text-white font-bold whitespace-nowrap hover-bg-047857 transition-all text-[14px]"
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
