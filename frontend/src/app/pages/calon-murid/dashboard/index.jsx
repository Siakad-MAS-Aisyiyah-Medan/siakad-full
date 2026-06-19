import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ClipboardList, CircleAlert, ListChecks, Phone, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import { fetchMyRegistration, fetchPpdbInfo } from '@app/shared/services/ppdb.service';
import { startOrResumePpdb } from '@app/shared/ppdb/utils/startOrResumePpdb';
import { toastValidation } from '@app/shared/hooks/useConfirm';

function formatDateLabel(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

function Section({ icon, title, children, delay = 0 }) {
  return (
    <section
      className="animate-fade-in-up"
      style={{
        borderTop: '1px solid #f1f5f9',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{
          width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0,
          background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#059669',
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#064e3b', lineHeight: 1.3, marginBottom: '0.65rem' }}>{title}</h2>
          <div style={{ fontSize: '0.875rem', lineHeight: 1.8, color: '#475569' }}>{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function DashboardCalonMurid() {
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [ppdbInfo, setPpdbInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchMyRegistration().catch(() => ({ has_registration: false, pendaftaran: null })),
      fetchPpdbInfo().catch(() => null),
    ])
      .then(([regData, info]) => {
        setRegistration(regData);
        setPpdbInfo(info);
      })
      .finally(() => setLoading(false));
  }, []);

  const registrationPeriod = useMemo(() => {
    return {
      start: formatDateLabel(ppdbInfo?.tanggal_buka || ppdbInfo?.periode_mulai || '2026-06-01'),
      end: formatDateLabel(ppdbInfo?.tanggal_tutup || ppdbInfo?.periode_selesai || '2026-06-30'),
    };
  }, [ppdbInfo]);

  const handleQuickStart = async () => {
    const result = await startOrResumePpdb();
    if (!result.ok) {
      await toastValidation('Periksa Kembali', result.error || 'Pendaftaran belum dapat dilanjutkan.');
      return;
    }
    navigate(result.path);
  };

  return (
    <CalonMuridLayout>
      <div className="mx-auto flex max-w-[1120px] flex-col gap-5 px-1 py-2">
        <div className="animate-fade-in">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#064e3b', letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Portal pendaftaran murid baru</p>
        </div>

        <div
          className="animate-fade-in-up"
          style={{
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            padding: '1.75rem 2rem',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
            animationDelay: '0.1s',
            opacity: 0,
          }}
        >
          {/* Header */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#064e3b', letterSpacing: '-0.01em' }}>
              {ppdbInfo?.judul || 'Pendaftaran Murid Baru Tahun Ajaran 2026/2027'}
            </h2>
            <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: '#475569' }}>
              <CalendarDays style={{ width: '18px', height: '18px', color: '#059669' }} />
              <span>Pendaftaran dibuka dari</span>
              <span style={{ borderRadius: '8px', border: '1px solid #d1fae5', background: '#ecfdf5', padding: '0.3rem 0.75rem', fontWeight: 600, color: '#064e3b', fontSize: '0.8rem' }}>
                {registrationPeriod.start}
              </span>
              <span>sampai</span>
              <span style={{ borderRadius: '8px', border: '1px solid #d1fae5', background: '#ecfdf5', padding: '0.3rem 0.75rem', fontWeight: 600, color: '#064e3b', fontSize: '0.8rem' }}>
                {registrationPeriod.end}
              </span>
            </div>
          </div>

          {/* Sections */}
          <div>
            <Section icon={<ClipboardList style={{ width: '22px', height: '22px' }} />} title="Syarat Pendaftaran" delay={0.15}>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem' }} className="space-y-2">
                <li>Mengisi formulir pendaftaran secara lengkap.</li>
                <li>Mengunggah seluruh berkas persyaratan yang ditentukan sekolah.</li>
                <li>Memastikan data yang diinput sesuai dengan dokumen asli.</li>
                <li>Mengirim pendaftaran sebelum batas waktu yang ditentukan.</li>
              </ul>
            </Section>

            <Section icon={<ListChecks style={{ width: '22px', height: '22px' }} />} title="Alur Pendaftaran" delay={0.2}>
              <ol className="space-y-2" style={{ paddingLeft: '1.25rem' }}>
                <li>1. Lengkapi Formulir Pendaftaran.</li>
                <li>2. Unggah Berkas Pendaftaran.</li>
                <li>3. Kirim Pendaftaran.</li>
                <li>4. Tunggu proses verifikasi dari sekolah.</li>
                <li>5. Lihat hasil pada menu Status Pendaftaran.</li>
              </ol>
            </Section>

            <Section icon={<CircleAlert style={{ width: '22px', height: '22px' }} />} title="Informasi Penting" delay={0.25}>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem' }} className="space-y-2">
                <li>Pastikan seluruh data yang diinput sudah benar sebelum mengirim pendaftaran.</li>
                <li>Pendaftaran yang sudah dikirim tidak dapat diubah kembali.</li>
                <li>Hasil seleksi dapat dilihat melalui menu Status Pendaftaran.</li>
              </ul>
            </Section>

            <Section icon={<Phone style={{ width: '22px', height: '22px' }} />} title="Kontak Sekolah" delay={0.3}>
              <div style={{ display: 'grid', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Phone style={{ width: '16px', height: '16px', color: '#059669' }} />
                  <span style={{ fontWeight: 600, color: '#64748b', width: '65px', fontSize: '0.82rem' }}>No. HP</span>
                  <span>: 0812-3456-7890</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <MapPin style={{ width: '16px', height: '16px', marginTop: '0.1rem', color: '#059669' }} />
                  <span style={{ fontWeight: 600, color: '#64748b', width: '65px', fontSize: '0.82rem' }}>Alamat</span>
                  <span>: Jl. Demak No. 3, Medan, Sumatera Utara</span>
                </div>
              </div>
            </Section>
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '0.85rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => navigate('/calon-murid/status')}
              style={{
                borderRadius: '14px', border: '1.5px solid #e2e8f0', padding: '0.75rem 1.5rem',
                fontSize: '0.875rem', fontWeight: 600, color: '#475569', background: '#ffffff',
                cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#a7f3d0'; e.currentTarget.style.background = '#ecfdf5'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
            >
              Lihat Status Pendaftaran
            </button>
            <button
              type="button"
              onClick={handleQuickStart}
              style={{
                borderRadius: '14px', border: 'none', padding: '0.75rem 1.5rem',
                fontSize: '0.875rem', fontWeight: 600, color: '#ffffff',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                cursor: 'pointer', transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(5, 150, 105, 0.3)'; }}
            >
              {registration?.has_registration ? 'Lanjutkan Pendaftaran' : 'Mulai Pendaftaran'}
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        {loading && <p style={{ padding: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>Memuat informasi pendaftaran...</p>}
      </div>
    </CalonMuridLayout>
  );
}
