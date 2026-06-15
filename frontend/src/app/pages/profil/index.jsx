import React, { useState, useEffect } from 'react';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import { User as UserIcon, Save, Check, X, Loader2, MapPin, Phone, Hash, Calendar, Heart, ShieldCheck } from 'lucide-react';
import { fetchMe } from '@app/shared/services/auth.service';
import { updateBiodataProfile } from '@app/shared/services/akun.service';
import Swal from 'sweetalert2';

export default function ProfilBiodataPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [form, setForm] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMe();
      if (data && data.user) {
        setUserRole(data.user.role);
        // data.profile contains the biodata specific to the role
        setForm(data.profile || {});
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal memuat data profil', 'error');
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
      await updateBiodataProfile(form);
      Swal.fire({
        icon: 'success',
        title: 'Sukses',
        text: 'Data berhasil disimpan',
        confirmButtonColor: '#10b981'
      });
      setIsEditing(false);
      loadData();
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || err.message || 'Gagal menyimpan profil', 'error');
    } finally {
      setSaving(false);
    }
  };

  const renderFields = () => {
    if (!userRole) return null;

    if (userRole === 'guru' || userRole === 'wali_kelas') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field name="nip_nuptk" label="NIP / NUPTK" value={form.nip_nuptk} icon={Hash} disabled={!isEditing} />
          <Field name="nama_guru" label="Nama Lengkap" value={form.nama_guru} icon={UserIcon} disabled={!isEditing} required />
          <Field name="jenis_kelamin" label="Jenis Kelamin" type="select" options={[{label:'Laki-laki', value:'L'}, {label:'Perempuan', value:'P'}]} value={form.jenis_kelamin} icon={Heart} disabled={!isEditing} />
          <Field name="agama" label="Agama" value={form.agama} icon={Heart} disabled={!isEditing} />
          <Field name="no_hp" label="Nomor HP" value={form.no_hp} icon={Phone} disabled={!isEditing} />
          <Field name="alamat" label="Alamat" value={form.alamat} icon={MapPin} disabled={!isEditing} isTextArea />
        </div>
      );
    }

    if (userRole === 'siswa') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field name="nisn" label="NISN" value={form.nisn} icon={Hash} disabled={!isEditing} />
          <Field name="nis" label="NIS" value={form.nis} icon={Hash} disabled={!isEditing} />
          <Field name="nama_siswa" label="Nama Lengkap" value={form.nama_siswa} icon={UserIcon} disabled={!isEditing} required />
          <Field name="tempat_lahir" label="Tempat Lahir" value={form.tempat_lahir} icon={MapPin} disabled={!isEditing} />
          <Field name="tgl_lahir" label="Tanggal Lahir" type="date" value={form.tgl_lahir ? form.tgl_lahir.split('T')[0] : ''} icon={Calendar} disabled={!isEditing} />
          <Field name="jenis_kelamin" label="Jenis Kelamin" type="select" options={[{label:'Laki-laki', value:'L'}, {label:'Perempuan', value:'P'}]} value={form.jenis_kelamin} icon={Heart} disabled={!isEditing} />
          <Field name="agama" label="Agama" value={form.agama} icon={Heart} disabled={!isEditing} />
          <Field name="no_hp_wali" label="Nomor HP Wali" value={form.no_hp_wali} icon={Phone} disabled={!isEditing} />
          <Field name="nama_wali" label="Nama Wali" value={form.nama_wali} icon={UserIcon} disabled={!isEditing} />
          <Field name="alamat" label="Alamat" value={form.alamat} icon={MapPin} disabled={!isEditing} isTextArea />
        </div>
      );
    }

    if (userRole === 'kepsek' || userRole === 'admin') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field name="nip" label="NIP" value={form.nip} icon={Hash} disabled={!isEditing} />
          <Field name="nama_lengkap" label="Nama Lengkap" value={form.nama_lengkap} icon={UserIcon} disabled={!isEditing} required />
          {userRole === 'kepsek' && (
            <>
              <Field name="jenis_kelamin" label="Jenis Kelamin" type="select" options={[{label:'Laki-laki', value:'L'}, {label:'Perempuan', value:'P'}]} value={form.jenis_kelamin} icon={Heart} disabled={!isEditing} />
              <Field name="alamat" label="Alamat" value={form.alamat} icon={MapPin} disabled={!isEditing} isTextArea />
            </>
          )}
          <Field name="no_hp" label="Nomor HP" value={form.no_hp} icon={Phone} disabled={!isEditing} />
        </div>
      );
    }
    
    return <div className="text-slate-500 italic">Profil tidak tersedia untuk role ini.</div>;
  };

  const Field = ({ name, label, value, icon: Icon, disabled, type = 'text', options, isTextArea, required }) => (
    <div className={isTextArea ? "md:col-span-2" : ""}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-emerald-500"/>} {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100"
        >
          <option value="">Pilih {label}</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea
          name={name}
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          rows="3"
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100"
        ></textarea>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100"
        />
      )}
    </div>
  );

  return (
    <AdminPageShell>
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-5 lg:py-6 flex flex-col gap-6 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 px-6 py-4 shadow-lg shadow-emerald-500/15">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                <UserIcon size={20} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-black text-white tracking-tight">Profil Saya</h1>
                <p className="text-emerald-100/80 text-xs mt-0.5 truncate font-medium">
                  Kelola biodata dan informasi pribadi Anda
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
               <h2 className="text-base font-bold text-slate-700">Informasi Biodata</h2>
               <p className="text-sm text-slate-400 font-medium">Lengkapi profil untuk keperluan administrasi</p>
             </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
             {loading && !isEditing ? (
               <div className="flex justify-center items-center py-10">
                 <Loader2 size={24} className="text-emerald-500 animate-spin" />
               </div>
             ) : (
               renderFields()
             )}
          </div>

          {/* Footer Actions */}
          {isEditing && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  loadData(); // Reset
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
