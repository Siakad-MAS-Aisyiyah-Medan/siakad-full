import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  CircleUserRound,
  School,
  XCircle,
  FileText,
  UserCircle2,
  Users,
  MapPin,
  Calendar,
  Phone,
  Briefcase,
  Download,
  ExternalLink,
  FolderOpen
} from 'lucide-react';
import AdminPageShell from '@/shared/components/AdminPageShell';
import { fetchAdminPendaftarDetail } from '@/shared/services/ppdb.service';
import { useAdminPpdb } from '@/shared/ppdb/hooks/useAdminPpdb';
import { resolveStorageUrl } from '@/shared/services/apiHelpers';
import { apiConfig } from '@/config/api.config';

function InfoField({ label, value, icon: Icon, isFullWidth = false }) {
  return (
    <div style={{
      display: 'flex', gap: '1rem', alignItems: 'flex-start',
      gridColumn: isFullWidth ? '1 / -1' : 'auto'
    }}>
      {Icon && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: '0.2rem'
        }}>
          <Icon size={18} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <p style={{ fontSize: '1rem', lineHeight: 1.5, color: 'var(--color-text-dark)', fontWeight: 500, margin: 0, whiteSpace: 'pre-line' }}>
          {value || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>-</span>}
        </p>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="form-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
      <h3 style={{
        fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-dark)',
        marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)'
      }}>
        {Icon && <Icon size={22} />} {title}
      </h3>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || '').toLowerCase();
  const labelMap = {
    submitted: 'Menunggu', diajukan: 'Menunggu',
    verified: 'Terverifikasi', terverifikasi: 'Terverifikasi',
    accepted: 'Diterima', diterima: 'Diterima',
    rejected: 'Ditolak', ditolak: 'Ditolak',
    revision: 'Revisi', revisi: 'Revisi',
    menjadi_murid: 'Siswa Aktif',
  };
  
  let bg = '#fef3c7', color = '#d97706'; // warning (amber)
  if (['accepted', 'diterima', 'verified', 'terverifikasi', 'menjadi_murid'].includes(normalized)) {
    bg = '#d1fae5'; color = '#059669'; // success (emerald)
  } else if (['rejected', 'ditolak'].includes(normalized)) {
    bg = '#fee2e2'; color = '#dc2626'; // danger (red)
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      background: bg, color: color, padding: '0.3rem 0.8rem',
      borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700,
      letterSpacing: '0.05em', textTransform: 'uppercase'
    }}>
      {labelMap[normalized] || 'Menunggu'}
    </span>
  );
}

function FileLink({ label, path }) {
  if (!path) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontStyle: 'italic', fontWeight: 500 }}>Belum diunggah</span>
      </div>
    );
  }

  const url = resolveStorageUrl(path, apiConfig);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <a href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', fontSize: '0.85rem', background: '#f8fafc', color: 'var(--color-primary-dark)', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--color-primary-soft)'; e.currentTarget.style.borderColor = 'var(--color-primary-light)'; }} onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
          <ExternalLink size={14} /> Lihat File
        </a>
        <a href={url} download target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}>
          <Download size={14} /> Unduh
        </a>
      </div>
    </div>
  );
}

const BERKAS_FILE_MAP = {
  kartu_keluarga: 'file_kk',
  nisn: 'file_nisn',
  pas_foto: 'file_pas_photo',
  ijazah_atau_skl: 'file_ijazah',
  stk: 'file_stk',
  ktp_orang_tua: 'file_ktp_ortua',
};

function resolveBerkasPath(data, jenis) {
  const legacyField = BERKAS_FILE_MAP[jenis];
  if (data?.[legacyField]) return data[legacyField];

  const items = Array.isArray(data?.berkas) ? data.berkas : [];
  const item = items.find((entry) => entry?.jenis_berkas === jenis);

  return item?.file_path || item?.path_file || item?.url || item?.preview_url || null;
}

import PageHeader from '@/shared/components/PageHeader';

export default function AdminDetailPendaftar({ readOnly = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const ppdb = useAdminPpdb();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchAdminPendaftarDetail(id)
      .then((response) => {
        if (active) setData(response);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const status = data?.status || data?.ppdb_status;
  const isPending = ['submitted', 'diajukan', 'verified', 'terverifikasi'].includes(String(status || '').toLowerCase());
  const fullAddress = [data?.alamat, data?.kelurahan, data?.kecamatan, data?.kota]
    .filter(Boolean)
    .join(', ');

  const heroSchool = data?.asal_sekolah || data?.sekolah_asal || '-';

  const handleAction = async (actionFn) => {
    const success = await actionFn(id);
    if (success) {
      navigate(readOnly ? '/kepala-sekolah/data-ppdb' : '/admin/ppdb');
    }
  };

  if (loading) {
    return (
      <AdminPageShell>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
            <p>Memuat detail pendaftar...</p>
          </div>
        </div>
      </AdminPageShell>
    );
  }

  if (!data) {
    return (
      <AdminPageShell>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--color-text-muted)' }}>
          <div style={{ textAlign: 'center' }}>
            <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Data pendaftar tidak ditemukan.</p>
            <Link to={readOnly ? '/kepala-sekolah/data-ppdb' : '/admin/ppdb'} className="btn-outline" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Kembali ke Daftar
            </Link>
          </div>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell>
      <div className="admin-page-wrapper animate-fade-in" style={{ paddingTop: '1rem' }}>
        <PageHeader 
          title="Detail Pendaftar PPDB" 
          subtitle="Informasi lengkap calon peserta didik baru"
          backTo={readOnly ? '/kepala-sekolah/data-ppdb' : '/admin/ppdb'}
        />

        <div className="form-panel" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
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
                  background: 'var(--color-background)',
                  color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CircleUserRound size={42} strokeWidth={1.5} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
                  {data.nama_lengkap || 'Nama Tidak Tersedia'}
                </h1>
                <div style={{ display: 'flex' }}>
                  <StatusBadge status={status} />
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ padding: '2.5rem', position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <InfoField label="ID Pendaftaran" value={data.no_registrasi || data.id_pendaftaran} icon={FileText} />
              <InfoField label="Sekolah Asal" value={heroSchool} icon={School} />
              <InfoField label="Jenis Kelamin" value={data.jenis_kelamin} icon={UserCircle2} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
          <div>
            <SectionCard title="Data Calon Murid" icon={UserCircle2}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <InfoField label="Tempat Lahir" value={data.tempat_lahir} icon={MapPin} />
                <InfoField label="Tanggal Lahir" value={data.tanggal_lahir || data.tgl_lahir} icon={Calendar} />
                <InfoField label="Agama" value={data.agama} />
                <InfoField label="Warga Negara" value={data.kewarganegaraan || data.warga_negara || 'WNI'} />
                <InfoField label="Berat Badan" value={data.berat_badan ? `${data.berat_badan} kg` : '-'} />
                <InfoField label="Tinggi Badan" value={data.tinggi_badan ? `${data.tinggi_badan} cm` : '-'} />
                <InfoField label="Anak Ke" value={data.anak_ke} />
                <InfoField label="Status Keluarga" value={data.status_dalam_keluarga || data.jenjang_saudara} />
                <InfoField label="Golongan Darah" value={data.golongan_darah} />
                <InfoField label="Riwayat Penyakit" value={data.riwayat_penyakit || data.penyakit} />
                <InfoField label="Alamat Lengkap" value={fullAddress || data.alamat} icon={MapPin} isFullWidth />
                <InfoField label="No. Telepon / HP" value={data.no_hp || data.no_telp || data.no_hp_ortu} icon={Phone} isFullWidth />
              </div>
            </SectionCard>

            <SectionCard title="Informasi Pindahan & Tambahan" icon={FileText}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <InfoField label="No. STTB" value={data.no_sttb || data.sttb_no} />
                <InfoField label="Tahun Lulus" value={data.tahun_lulus} />
                <InfoField label="Pindahan Dari" value={data.pindahan_dari} />
                <InfoField label="No. Surat Pindah" value={data.no_surat_pindah} />
                {data.catatan_admin && (
                  <InfoField label="Catatan Admin" value={data.catatan_admin} isFullWidth />
                )}
              </div>
            </SectionCard>
          </div>

          <div>
            <SectionCard title="Data Orang Tua / Wali" icon={Users}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--color-border)' }}>Data Ayah</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <InfoField label="Nama Ayah" value={data.nama_ayah} icon={UserCircle2} />
                    <InfoField label="Pendidikan Terakhir" value={data.pendidikan_ayah} icon={School} />
                    <InfoField label="Pekerjaan" value={data.pekerjaan_ayah} icon={Briefcase} />
                    <InfoField label="No. HP" value={data.no_hp_ayah || data.telepon_ayah || data.hp_ayah} icon={Phone} />
                  </div>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--color-border)' }}>Data Ibu</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <InfoField label="Nama Ibu" value={data.nama_ibu} icon={UserCircle2} />
                    <InfoField label="Pendidikan Terakhir" value={data.pendidikan_ibu} icon={School} />
                    <InfoField label="Pekerjaan" value={data.pekerjaan_ibu} icon={Briefcase} />
                    <InfoField label="No. HP" value={data.no_hp_ibu || data.telepon_ibu || data.hp_ibu} icon={Phone} />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Berkas Pendaftaran" icon={FolderOpen}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', rowGap: '2rem' }}>
                <FileLink label="Kartu Keluarga (KK)" path={resolveBerkasPath(data, 'kartu_keluarga')} />
                <FileLink label="Akta Kelahiran" path={resolveBerkasPath(data, 'nisn')} />
                <FileLink label="Pas Foto" path={resolveBerkasPath(data, 'pas_foto')} />
                <FileLink label="Ijazah / STTB SMP" path={resolveBerkasPath(data, 'ijazah_atau_skl')} />
                <FileLink label="Rapor Semester 1-5" path={resolveBerkasPath(data, 'stk')} />
                <FileLink label="Surat Keterangan Lulus" path={resolveBerkasPath(data, 'ktp_orang_tua')} />
              </div>
            </SectionCard>

            {(!readOnly && (isPending || ['diterima', 'accepted'].includes(String(status || '').toLowerCase()))) && (
              <div className="form-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.8)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-dark)', margin: 0 }}>Aksi Pendaftaran</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0, marginBottom: '0.5rem' }}>
                  {['submitted', 'diajukan'].includes(String(status || '').toLowerCase()) 
                    ? 'Verifikasi keabsahan data pendaftar atau minta revisi jika ada yang salah.'
                    : ['diterima', 'accepted'].includes(String(status || '').toLowerCase())
                    ? 'Calon siswa ini sudah diterima. Klik tombol di bawah untuk menjadikannya Murid Aktif.'
                    : 'Tentukan apakah calon siswa ini diterima atau ditolak berdasarkan data di atas.'}
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['diterima', 'accepted'].includes(String(status || '').toLowerCase()) ? (
                    <button
                      type="button"
                      onClick={() => handleAction(ppdb.jadikanMurid)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        height: '46px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem',
                        background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.35)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)'; }}
                    >
                      <UserCircle2 size={18} /> Jadikan Murid Aktif
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(ppdb.tolak)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          height: '46px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem',
                          background: '#fff', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; }}
                      >
                        <XCircle size={18} /> Tolak
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(ppdb.revisi)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          height: '46px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem',
                          background: '#fff', color: '#d97706', border: '1px solid #fde68a', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#fffbeb'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; }}
                      >
                        <FileText size={18} /> Minta Revisi
                      </button>

                      {['submitted', 'diajukan'].includes(String(status || '').toLowerCase()) ? (
                        <button
                          type="button"
                          onClick={() => handleAction(ppdb.verifikasi)}
                          style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            height: '46px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem',
                            background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.35)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.25)'; }}
                        >
                          <CheckCircle2 size={18} /> Verifikasi Data
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAction(ppdb.terima)}
                          style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            height: '46px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem',
                            background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.35)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)'; }}
                        >
                          <CheckCircle2 size={18} /> Terima Pendaftar
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
