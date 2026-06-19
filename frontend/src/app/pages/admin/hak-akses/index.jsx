import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UserRoundCog,
  Users,
  X,
} from 'lucide-react';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import { confirmAction, toastError, toastSuccess, toastValidation } from '@app/shared/hooks/useConfirm';
import { createAdminAkun, deleteAdminAkun, fetchAdminAkunList, updateAdminAkun } from '@app/shared/services/akun.service';

const EMPTY_FORM = {
  nip_nisn: '',
  name: '',
  email: '',
  no_hp: '',
  password: '',
  confirmPassword: '',
  role: 'admin',
  status: 'aktif',
};

import PageHeader from '@app/shared/components/PageHeader';

export default function HakAksesPage() {
  const [akunData, setAkunData] = useState([]);
  const [stats, setStats] = useState({ total_akun: 0, role_aktif: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ last_page: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loadAkun = useCallback(async (page = currentPage, search = searchQuery) => {
    setIsLoading(true);
    try {
      const data = await fetchAdminAkunList({ page, search });
      const usersArray = Array.isArray(data?.users) ? data.users : [];
      setAkunData(usersArray);
      setStats({
        total_akun: data?.total_akun || usersArray.length,
        role_aktif: data?.role_aktif || 0,
      });
      if (data?.pagination) setPagination(data.pagination);
    } catch {
      toastError('Gagal', 'Data akun gagal dimuat.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => loadAkun(currentPage, searchQuery), 250);
    return () => clearTimeout(timer);
  }, [currentPage, loadAkun, searchQuery]);

  const closeModal = () => {
    setModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData(EMPTY_FORM);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const openCreateModal = () => {
    setFormData(EMPTY_FORM);
    setIsEditMode(false);
    setEditId(null);
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toastValidation('Periksa Kembali', 'Nama lengkap dan e-mail wajib diisi.');
      return;
    }

    if (!isEditMode && !formData.password.trim()) {
      toastValidation('Periksa Kembali', 'Password wajib diisi untuk akun baru.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toastValidation('Periksa Kembali', 'Konfirmasi password belum sama.');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        no_hp: formData.no_hp,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditMode) {
        await updateAdminAkun(editId, payload);
        toastSuccess('Berhasil', 'Data akun berhasil diperbarui.');
      } else {
        const baseUsername = formData.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || 'admin';
        payload.username = formData.nip_nisn.trim() || `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;
        await createAdminAkun(payload);
        toastSuccess('Berhasil', 'Akun baru berhasil ditambahkan.');
      }

      closeModal();
      await loadAkun();
    } catch (error) {
      toastError('Gagal', error?.response?.data?.message || 'Data akun gagal disimpan.');
    }
  };

  const handleEdit = (akun) => {
    setIsEditMode(true);
    setEditId(akun.id);
    setFormData({
      nip_nisn: akun.nip_nisn || '',
      name: akun.name || '',
      email: akun.email || '',
      no_hp: akun.no_hp || '',
      password: '',
      confirmPassword: '',
      role: akun.role || 'admin',
      status: akun.status || 'aktif',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction({
      title: 'Apakah Anda Yakin?',
      text: 'Akun yang dihapus tidak dapat dikembalikan.',
      confirmText: 'Yakin',
      cancelText: 'Batal',
    });

    if (!confirmed) return;

    try {
      await deleteAdminAkun(id);
      toastSuccess('Berhasil', 'Akun berhasil dihapus.');
      await loadAkun();
    } catch (error) {
      toastError('Gagal', error?.response?.data?.message || 'Akun gagal dihapus.');
    }
  };

  return (
    <AdminPageShell>
      <div className="animate-fade-in" style={{ paddingTop: '1rem' }}>
        <PageHeader title="Manajemen Pengguna" subtitle="Kelola akun dan hak akses pengguna sistem">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cari akun..."
              style={{ paddingLeft: '2.5rem', height: '38px', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', width: '220px', background: '#fff', color: 'var(--color-text-dark)' }}
            />
          </div>
          <button type="button" onClick={openCreateModal} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} />
            Tambah Akun
          </button>
        </PageHeader>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard
            value={stats.total_akun}
            label="Total Akun"
            icon={<Users size={22} />}
            gradient="linear-gradient(135deg, #059669, #10b981)"
          />
          <StatCard
            value={stats.role_aktif}
            label="Role Aktif"
            icon={<ShieldCheck size={22} />}
            gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
          />
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>NIP/NISN</th>
                <th>E-mail</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
                      Memuat data akun...
                    </div>
                  </td>
                </tr>
              ) : akunData.length > 0 ? (
                akunData.map((akun, idx) => (
                  <tr key={akun.id}>
                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{akun.nip_nisn || akun.username || '-'}</td>
                    <td>{akun.email}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: getRoleColor(akun.role).bg,
                        color: getRoleColor(akun.role).text,
                        border: `1px solid ${getRoleColor(akun.role).border}`,
                      }}>
                        <UserRoundCog size={11} />
                        {formatRole(akun.role)}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: akun.status === 'aktif' ? 'var(--color-primary-soft)' : '#fef2f2',
                        color: akun.status === 'aktif' ? 'var(--color-primary-dark)' : '#991b1b',
                        border: `1px solid ${akun.status === 'aktif' ? 'var(--color-primary-light)' : '#fecaca'}`,
                      }}>
                        {akun.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button type="button" onClick={() => handleEdit(akun)} className="btn-icon edit" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button type="button" onClick={() => handleDelete(akun.id)} className="btn-icon delete" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ fontSize: '2rem' }}>👤</div>
                      <p style={{ fontWeight: 600 }}>Tidak ada data akun</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Menampilkan {akunData.length} dari {pagination.total || akunData.length} akun
        </div>
      </div>

      {/* Modal */}
      {modalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.45)', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '680px', maxHeight: '92vh', overflowY: 'auto', background: '#fff', borderRadius: '20px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <button
                type="button"
                onClick={closeModal}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--color-border)', background: '#fff', cursor: 'pointer', color: 'var(--color-text-dark)' }}
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>
                  {isEditMode ? 'Edit Akun' : 'Tambah Akun Baru'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  {isEditMode ? 'Perbarui informasi akun pengguna' : 'Isi data untuk membuat akun baru'}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <FormLabel>NIP/NISN</FormLabel>
                  <input
                    value={formData.nip_nisn}
                    onChange={(e) => setFormData(p => ({ ...p, nip_nisn: e.target.value }))}
                    disabled={isEditMode}
                    placeholder="Isi jika tersedia"
                    className="form-control"
                  />
                </div>
                <div>
                  <FormLabel required>E-mail</FormLabel>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="Masukkan e-mail"
                    className="form-control"
                    required
                  />
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <FormLabel required>Nama Lengkap</FormLabel>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Masukkan nama lengkap"
                    className="form-control"
                    required
                  />
                </div>

                <div>
                  <FormLabel required>Role</FormLabel>
                  <select value={formData.role} onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))} className="form-control">
                    <option value="admin">Administrator</option>
                    <option value="kepsek">Kepala Sekolah</option>
                    <option value="guru">Guru</option>
                    <option value="siswa">Murid</option>
                  </select>
                </div>
                <div>
                  <FormLabel>No. Handphone</FormLabel>
                  <input
                    value={formData.no_hp}
                    onChange={(e) => setFormData(p => ({ ...p, no_hp: e.target.value }))}
                    placeholder="Masukkan nomor HP"
                    className="form-control"
                  />
                </div>

                <div>
                  <FormLabel required>Status</FormLabel>
                  <select value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))} className="form-control">
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
                <div />

                <div style={{ gridColumn: '1/-1' }}>
                  <FormLabel>Password {isEditMode ? '(kosongkan jika tidak ingin mengubah)' : ''}</FormLabel>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                      placeholder="Masukkan password"
                      className="form-control"
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="Konfirmasi password"
                      className="form-control"
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(p => !p)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--color-background)', borderRadius: '0 0 20px 20px' }}>
                <button type="button" onClick={closeModal} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <X size={16} /> Batal
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={16} />
                  {isEditMode ? 'Simpan Perubahan' : 'Tambahkan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </AdminPageShell>
  );
}

function StatCard({ value, label, icon, gradient }) {
  return (
    <div style={{
      background: gradient,
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
      <div>
        <p style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.35rem' }}>{value}</p>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>{label}</p>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.2)', width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
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

function formatRole(role) {
  const map = {
    admin: 'Administrator',
    kepsek: 'Kepala Sekolah',
    guru: 'Guru',
    siswa: 'Murid',
    calon_siswa: 'Calon Murid',
  };
  return map[role] || role;
}

function getRoleColor(role) {
  const map = {
    admin: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    kepsek: { bg: '#f5f3ff', text: '#5b21b6', border: '#c4b5fd' },
    guru: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    siswa: { bg: '#ecfdf5', text: '#064e3b', border: '#a7f3d0' },
    calon_siswa: { bg: '#fdf2f8', text: '#831843', border: '#f9a8d4' },
  };
  return map[role] || { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
}
