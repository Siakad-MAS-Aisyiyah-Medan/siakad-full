import { useEffect, useMemo, useState } from 'react';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import { Edit3, Loader2, UserCircle2, MapPin, Phone, CalendarDays, IdCard, ShieldCheck } from 'lucide-react';
import { fetchMe } from '@app/shared/services/auth.service';
import { toastError } from '@app/shared/hooks/useConfirm';

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

  useEffect(() => {
    fetchMe()
      .then((data) => {
        setRole(data?.user?.role || '');
        setProfile(data?.profile || {});
      })
      .catch(() => toastError('Gagal', 'Gagal memuat data profil'))
      .finally(() => setLoading(false));
  }, []);

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
        nomor: profile.nip_nuptk,
        nomorLabel: 'NIP',
        alamat: profile.alamat,
        noHp: profile.no_hp,
        tanggalLahir: profile.tanggal_lahir || profile.tgl_lahir || '-',
        kelas: profile.role_label || 'Guru',
      };
    }

    return {
      nama: profile.nama_lengkap || profile.nama_kepala_sekolah || 'Kepala Sekolah',
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

  return (
    <AdminPageShell>
      <div className="admin-page-wrapper animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0, letterSpacing: '-0.02em' }}>Profil Saya</h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: 0, marginTop: '0.5rem' }}>Informasi detail biodata dan peran Anda di sistem.</p>
          </div>
          <button type="button" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '50px' }}>
            <Edit3 size={18} />
            <span style={{ fontWeight: 600 }}>Edit Profil</span>
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin text-slate-500" size={32} />
          </div>
        ) : (
          <div className="form-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '140px', background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
            </div>
            
            <div style={{ padding: '0 2.5rem 2.5rem', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{
                  width: '110px', height: '110px', borderRadius: '24px',
                  background: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  marginTop: '-55px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{
                    width: '94px', height: '94px', borderRadius: '18px',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem', fontWeight: 800, letterSpacing: '0.05em'
                  }}>
                    {initials}
                  </div>
                </div>
                <div style={{ marginTop: '-1rem' }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0 }}>{display.nama}</h1>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
                    <ShieldCheck size={14} /> {display.kelas}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <InfoCard label="Nama Lengkap" value={display.nama} icon={UserCircle2} />
                <InfoCard label={display.nomorLabel} value={display.nomor} icon={IdCard} />
                <InfoCard label="Nomor Handphone" value={display.noHp} icon={Phone} />
                <InfoCard label="Tanggal Lahir" value={display.tanggalLahir} icon={CalendarDays} />
                <InfoCard label="Alamat Tempat Tinggal" value={display.alamat} icon={MapPin} />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}
