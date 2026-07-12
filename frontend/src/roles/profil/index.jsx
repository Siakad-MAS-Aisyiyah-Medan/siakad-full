import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageShell from '@/shared/components/AdminPageShell';
import { Edit3, Loader2, UserCircle2, MapPin, Phone, CalendarDays, IdCard, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { fetchMe } from '@/shared/services/auth.service';
import { deleteFotoProfil, updateBiodataProfile, uploadFotoProfil } from '@/shared/services/akun.service';
import { confirmAction, toastError, toastSuccess, toastValidation } from '@/shared/hooks/useConfirm';
import { apiConfig } from '@/config/api.config';
import PageHeader from '@/shared/components/PageHeader';
import { ArrowLeft, Save, X } from 'lucide-react';

function InfoCard({ label, value, icon: Icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fff', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <Icon size={22} />
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', margin: 0, marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-dark)', margin: 0, wordBreak: 'break-word', lineHeight: 1.4 }}>{value || '-'}</p>
      </div>
    </div>
  );
}

export default function ProfilBiodataPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [profile, setProfile] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchMe()
      .then((data) => {
        setRole(data?.user?.role || '');
        setProfile(data?.profile || {});
        
        // Initialize form
        setForm({
          nama_lengkap: data?.profile?.nama_admin || data?.profile?.nama_kepsek || data?.profile?.nama_guru || data?.profile?.nama_siswa || '',
          nip: data?.profile?.nip || data?.profile?.nip_nuptk || data?.profile?.nisn || '',
          no_hp: data?.profile?.no_hp || data?.profile?.no_hp_wali || '',
          alamat: data?.profile?.alamat || '',
          jenis_kelamin: data?.profile?.jenis_kelamin || '',
          tgl_lahir: String(data?.profile?.tgl_lahir || data?.profile?.tanggal_lahir || '').slice(0, 10),
        });
      })
      .catch(() => toastError('Gagal', 'Gagal memuat data profil'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload = {};
      if (role === 'kepsek') {
        payload = { nama_lengkap: form.nama_lengkap, nip: form.nip, no_hp: form.no_hp, alamat: form.alamat, jenis_kelamin: form.jenis_kelamin, tgl_lahir: form.tgl_lahir || null };
      } else if (role === 'guru') {
        payload = { nama_guru: form.nama_lengkap, nip: form.nip, no_hp: form.no_hp, alamat: form.alamat, jenis_kelamin: form.jenis_kelamin, tgl_lahir: form.tgl_lahir || null };
      } else if (role === 'admin') {
        payload = { nama_lengkap: form.nama_lengkap, nip: form.nip, no_hp: form.no_hp };
      } else if (role === 'siswa') {
        payload = { nama_siswa: form.nama_lengkap, nisn: form.nip, no_hp_wali: form.no_hp, alamat: form.alamat, jenis_kelamin: form.jenis_kelamin, tgl_lahir: form.tgl_lahir };
      }

      const res = await updateBiodataProfile(payload);
      toastSuccess('Berhasil', 'Profil berhasil diperbarui');
      setProfile(prev => ({ ...prev, ...res }));
      setIsEditing(false);
    } catch (error) {
      toastError('Gagal', error.response?.data?.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      await toastValidation('Berkas Tidak Valid', 'Gunakan gambar JPG atau PNG dengan ukuran maksimal 2 MB.');
      return;
    }

    setUploadingPhoto(true);
    try {
      const result = await uploadFotoProfil(file);
      setProfile((current) => ({ ...current, foto: result.foto_url }));
      await toastSuccess('Berhasil', 'Foto profil berhasil diperbarui');
    } catch (error) {
      await toastError('Gagal', error.response?.data?.message || 'Gagal mengunggah foto profil');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async () => {
    const confirmed = await confirmAction({
      title: 'Hapus Foto Profil?',
      text: 'Foto profil akan dihapus dari akun Anda.',
      confirmText: 'Hapus',
    });
    if (!confirmed) return;

    setUploadingPhoto(true);
    try {
      await deleteFotoProfil();
      setProfile((current) => ({ ...current, foto: null }));
      await toastSuccess('Berhasil', 'Foto profil berhasil dihapus');
    } catch (error) {
      await toastError('Gagal', error.response?.data?.message || 'Gagal menghapus foto profil');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const display = useMemo(() => {
    if (role === 'siswa') {
      return {
        nama: profile.nama_siswa,
        nomor: profile.nisn,
        nomorLabel: 'NISN',
        alamat: profile.alamat,
        noHp: profile.no_hp || profile.no_hp_wali,
        tanggalLahir: profile.tgl_lahir || profile.tanggal_lahir,
        kelas: profile.kelas?.nama_kelas || profile.nama_kelas || 'X IPA 1',
      };
    }

    if (role === 'guru') {
      return {
        nama: profile.nama_guru,
        nomor: profile.nip || profile.nip_nuptk,
        nomorLabel: 'NIP',
        alamat: profile.alamat,
        noHp: profile.no_hp,
        tanggalLahir: profile.tanggal_lahir || profile.tgl_lahir || '-',
        kelas: profile.role_label || 'Guru',
      };
    }

    return {
      nama: profile.nama_kepsek || profile.nama_admin || (role === 'kepsek' ? 'Kepala Sekolah' : 'Administrator'),
      nomor: profile.nip || profile.nip_nuptk,
      nomorLabel: 'NIP',
      alamat: profile.alamat,
      noHp: profile.no_hp,
      tanggalLahir: profile.tanggal_lahir || '-',
      kelas: role === 'kepsek' ? 'Kepala Sekolah' : 'Administrator',
    };
  }, [profile, role]);

  const initials = display.nama
    ? display.nama.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';
  const photoUrl = profile.foto
    ? `${apiConfig.baseURL.replace(/\/api\/?$/, '')}${profile.foto}`
    : null;

  return (
    <AdminPageShell>
      <PageHeader 
        title={isEditing ? 'Edit Biodata Diri' : 'Profil Saya'}
        subtitle={isEditing ? 'Perbarui informasi biodata diri Anda' : 'Informasi detail biodata dan peran Anda di sistem.'}
        backTo={isEditing ? undefined : ""}
        onBack={isEditing ? () => setIsEditing(false) : undefined}
        actions={
          isEditing ? null : (
            <button type="button" onClick={() => setIsEditing(true)} className="btn-outline">
              <Edit3 size={18} />
              <span style={{ fontWeight: 600 }}>Edit Profil</span>
            </button>
          )
        }
      />
      <div className="admin-page-wrapper animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '1rem' }}>

        {loading ? (
          <div style={{ display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin text-slate-500" size={32} />
          </div>
        ) : (
          <div className="form-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '2.5rem', background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 1 }}>
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', fontWeight: 800, letterSpacing: '0.05em', overflow: 'hidden'
                  }}>
                    {photoUrl ? (
                      <img src={photoUrl} alt={`Foto profil ${display.nama}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : initials}
                  </div>
                </div>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>{display.nama}</h1>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.6rem', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <ShieldCheck size={15} /> {display.kelas}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                    <label className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: uploadingPhoto ? 'wait' : 'pointer', background: '#fff' }}>
                      <Upload size={16} /> {uploadingPhoto ? 'Memproses...' : 'Ganti Foto'}
                      <input type="file" accept="image/png,image/jpeg" onChange={handlePhotoUpload} disabled={uploadingPhoto} hidden />
                    </label>
                    {photoUrl && (
                      <button type="button" className="btn-outline" onClick={handlePhotoDelete} disabled={uploadingPhoto} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', background: '#fff' }}>
                        <Trash2 size={16} /> Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '2.5rem', position: 'relative' }}>
              {isEditing ? (
                <form onSubmit={handleSave}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                      <label className="form-label">Nama Lengkap</label>
                      <input name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} className="form-control" required />
                    </div>
                    <div>
                      <label className="form-label">{display.nomorLabel}</label>
                      <input name="nip" value={form.nip} onChange={handleChange} className="form-control" />
                    </div>
                    <div>
                      <label className="form-label">Nomor Handphone</label>
                      <input name="no_hp" value={form.no_hp} onChange={handleChange} className="form-control" />
                    </div>
                    {role !== 'admin' && (
                      <div>
                        <label className="form-label">Jenis Kelamin</label>
                        <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className="form-control">
                          <option value="">Pilih...</option>
                          <option value="L">Laki-Laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                    )}
                    {(role === 'siswa' || role === 'guru' || role === 'kepsek') && (
                      <div>
                        <label className="form-label">Tanggal Lahir</label>
                        <input type="date" name="tgl_lahir" value={form.tgl_lahir} onChange={handleChange} className="form-control" />
                      </div>
                    )}
                    {role !== 'admin' && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Alamat Lengkap</label>
                        <textarea name="alamat" value={form.alamat} onChange={handleChange} className="form-control" rows="3"></textarea>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                    <button type="button" onClick={() => setIsEditing(false)} className="btn-outline">
                      <X size={18} style={{ marginRight: '0.5rem' }} /> Batal
                    </button>
                    <button type="submit" disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
                      <Save size={18} style={{ marginRight: '0.5rem' }} /> {saving ? 'Menyimpan...' : 'Simpan Profil'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  <InfoCard label="Nama Lengkap" value={display.nama} icon={UserCircle2} />
                  <InfoCard label={display.nomorLabel} value={display.nomor} icon={IdCard} />
                  <InfoCard label="Nomor Handphone" value={display.noHp} icon={Phone} />
                  <InfoCard label="Tanggal Lahir" value={display.tanggalLahir} icon={CalendarDays} />
                  <InfoCard label="Alamat Tempat Tinggal" value={display.alamat} icon={MapPin} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}
