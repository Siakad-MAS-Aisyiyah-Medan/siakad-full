import React, { useState, useEffect } from 'react';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import { Settings, Save, Check, X, AlertCircle, Loader2, ShieldCheck, User as UserIcon, Mail, Lock } from 'lucide-react';
import { fetchMe } from '@app/shared/services/auth.service';
import { updateAdminProfile } from '@app/shared/services/akun.service';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);
  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };
  const icons = { success: Check, error: X, warning: AlertCircle };
  const Icon = icons[type] || Check;
  return (
    <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl backdrop-blur-sm animate-in slide-in-from-right-2 fade-in duration-300 ${styles[type]}`}>
      <Icon size={18} className="shrink-0" />
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity"><X size={14} /></button>
    </div>
  );
}

export default function PengaturanSistemPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = await fetchMe();
      if (userData) {
        setForm(prev => ({
          ...prev,
          name: userData.name || '',
          username: userData.username || '',
          email: userData.email || '',
        }));
      }
    } catch (err) {
      setToast({ message: 'Gagal memuat profil', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        username: form.username,
        email: form.email,
      };
      if (form.new_password) {
        payload.current_password = form.current_password;
        payload.new_password = form.new_password;
        payload.new_password_confirmation = form.new_password_confirmation;
      }
      const res = await updateAdminProfile(payload);
      
      setToast({ message: 'Data berhasil disimpan', type: 'success' });
      setIsEditing(false);
      setForm(prev => ({ ...prev, current_password: '', new_password: '', new_password_confirmation: '' }));
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      setToast({ message: err?.response?.data?.message || err.message || 'Gagal menyimpan profil', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPageShell>
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-5 lg:py-6 flex flex-col gap-6 animate-in fade-in duration-500">
        
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 px-6 py-4 shadow-lg shadow-emerald-500/15">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                <Settings size={20} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-black text-white tracking-tight">Pengaturan</h1>
                <p className="text-emerald-100/80 text-xs mt-0.5 truncate font-medium">
                  Kelola informasi akun dan kata sandi administrator
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white rounded-xl text-xs font-bold transition-all border border-white/10"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/50">
             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
               <ShieldCheck size={20} />
             </div>
             <div>
               <h2 className="text-base font-bold text-slate-700">Profil Administrator</h2>
               <p className="text-sm text-slate-400 font-medium">Informasi utama akun Anda</p>
             </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
             {loading && !isEditing ? (
               <div className="flex justify-center items-center py-10">
                 <Loader2 size={24} className="text-emerald-500 animate-spin" />
               </div>
             ) : (
               <>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nama Akun */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <UserIcon size={12} className="text-emerald-500"/> Nama Akun
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100"
                        placeholder="Admin MAS Aisyiyah Medan"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Lock size={12} className="text-emerald-500"/> Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100"
                        placeholder="admin123"
                      />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Mail size={12} className="text-emerald-500"/> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100"
                        placeholder="admin@email.com"
                      />
                    </div>
                 </div>

                 {/* Change Password Section */}
                 {isEditing && (
                   <div className="pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-4">
                        <Lock size={14} className="text-emerald-500" />
                        <h3 className="text-sm font-bold text-slate-700">Ubah Kata Sandi (Opsional)</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Saat Ini</label>
                            <input
                              type="password"
                              name="current_password"
                              value={form.current_password}
                              onChange={handleChange}
                              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all"
                              placeholder="Masukkan password saat ini untuk keamanan"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Baru</label>
                            <input
                              type="password"
                              name="new_password"
                              value={form.new_password}
                              onChange={handleChange}
                              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all"
                              placeholder="Minimal 6 karakter"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Konfirmasi Password Baru</label>
                            <input
                              type="password"
                              name="new_password_confirmation"
                              value={form.new_password_confirmation}
                              onChange={handleChange}
                              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all"
                              placeholder="Ulangi password baru"
                            />
                         </div>
                      </div>
                   </div>
                 )}
               </>
             )}
          </div>

          {/* Footer Actions */}
          {isEditing && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  loadData(); // Reset
                  setForm(prev => ({ ...prev, current_password: '', new_password: '', new_password_confirmation: '' }));
                }}
                disabled={saving}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 disabled:shadow-none"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          )}
        </div>

      </div>
    </AdminPageShell>
  );
}
