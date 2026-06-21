import { useEffect, useState } from 'react';
import { Check, Clock3, Info, Loader2, TriangleAlert, XCircle } from 'lucide-react';
import CalonMuridLayout from '@/shared/ppdb/layouts/CalonMuridLayout';
import { fetchMyRegistration, fetchPpdbStatus } from '@/shared/services/ppdb.service';
import { getJsonItem } from '@/shared/utils/storage';
import { normalizePpdbStatus } from '@/shared/ppdb/utils/dashboardState';
import { calculateFormulirProgress } from '@/shared/ppdb/utils/ppdbWizardValidation';
import './status-pendaftaran.css';

const STATUS_COPY = {
  none: ['Belum Mendaftar', 'Silakan lengkapi formulir dan berkas pendaftaran Anda.'],
  draft: ['Belum Dikirim', 'Lengkapi formulir dan berkas, lalu kirim pendaftaran Anda.'],
  revision: ['Perlu Perbaikan', 'Periksa catatan sekolah dan perbaiki data pendaftaran Anda.'],
  submitted: ['Menunggu Verifikasi', 'Pendaftaran Anda sedang dalam proses verifikasi oleh pihak sekolah.'],
  verified: ['Sudah Diverifikasi', 'Data Anda telah diverifikasi dan sedang menunggu keputusan sekolah.'],
  accepted: ['Pendaftaran Diterima', 'Selamat, pendaftaran Anda telah diterima oleh pihak sekolah.'],
  rejected: ['Pendaftaran Ditolak', 'Pendaftaran belum dapat diterima. Silakan lihat keterangan dari sekolah.'],
};

export default function StatusPendaftaran() {
  const user = getJsonItem('user');
  const [data, setData] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPpdbStatus(), fetchMyRegistration()])
      .then(([status, current]) => { setData(status); setRegistration(current?.pendaftaran || null); })
      .catch((error) => console.error('Gagal memuat status PPDB', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <CalonMuridLayout title="Status Pendaftaran" subtitle="Pantau proses dan status pendaftaran Anda.">
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <Loader2 size={40} className="sp-spin mb-4" />
          <p>Memuat status...</p>
        </div>
      </CalonMuridLayout>
    );
  }

  const status = normalizePpdbStatus(data ? { ppdb_status: data.status } : null);
  const [title, description] = STATUS_COPY[status] || STATUS_COPY.none;
  const StatusIcon = status === 'accepted' || status === 'verified' ? Check : status === 'rejected' ? XCircle : status === 'revision' ? TriangleAlert : Clock3;
  const formPercent = calculateFormulirProgress(registration);
  const files = Array.isArray(registration?.berkas) ? registration.berkas : [];
  const filePercent = Math.min(100, Math.round(files.filter((item) => item.url).length / 6 * 100));
  const sentDate = data?.submitted_at ? new Date(data.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

  return (
    <CalonMuridLayout title="Status Pendaftaran" subtitle="Pantau proses dan status pendaftaran Anda.">
      <div className={`sp-status-page sp-status-page--${status}`}>
        <section className="sp-status-hero">
          <p>Status Pendaftaran Anda</p>
          <div className="sp-status-hero__title">
            <StatusIcon size={64} strokeWidth={1.8} />
            <h2>{title}</h2>
          </div>
          <span>{description}</span>
        </section>

        <section className="sp-panel sp-status-info">
          <h2>Informasi Pendaftaran</h2>
          <dl>
            <div><dt>Nama Lengkap</dt><dd>{registration?.nama_lengkap || user?.name || '-'}</dd></div>
            <div><dt>Tanggal Pengiriman</dt><dd>{sentDate}</dd></div>
            <div><dt>Sekolah Tujuan</dt><dd>MAS Aisyiyah Medan</dd></div>
          </dl>
        </section>

        <section className="sp-panel sp-status-progress">
          <h2>Progres Pendaftaran</h2>
          <div className="sp-progress-grid">
            <Progress label="Formulir Pendaftaran" percent={formPercent} />
            <Progress label="Berkas Pendaftaran" percent={filePercent} />
          </div>
        </section>

        <section className="sp-panel sp-status-note">
          <Info size={30} />
          <div>
            <h2>Keterangan</h2>
            <p>{data?.catatan_admin || 'Harap menunggu informasi lebih lanjut melalui email atau pengumuman resmi sekolah.'}</p>
          </div>
        </section>
      </div>
    </CalonMuridLayout>
  );
}

function Progress({ label, percent }) {
  return (
    <div className="sp-progress-item">
      <div className="sp-progress-label">
        <span className={percent === 100 ? 'is-complete' : ''}>
          {percent === 100 ? <Check size={18} strokeWidth={2.5} /> : null}
        </span>
        <strong>{label}</strong>
        <b>{percent}%</b>
      </div>
      <div className="sp-progress-track">
        <i style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
